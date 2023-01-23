use regex::Regex;
use std::{
    collections::HashMap,
    env::current_dir,
    fs,
    hash::Hash,
    io,
    path::{Path, PathBuf},
};

const HYPERFUNCTIONS_DIR: &str = "../../api/_hyperfunctions";
const TEMPLATE_DIR: &str = "../../api/.templates/hyperfunctions";

#[derive(Debug)]
enum TemplateType {
    SimpleMarkdown,
    Aggregate,
    Accessor,
    Rollup,
}

#[derive(Debug)]
struct Template {
    file_name: String,
    template_type: TemplateType,
}

#[derive(Debug)]
struct TemplateMetadata {
    aggregate: String,
    category: String,
    is_experimental: bool,
    version: String,
}

type Replacement = (Regex, String);

#[derive(Debug)]
struct Replacements {
    simple_markdown: Vec<Replacement>,
    yaml: Vec<Replacement>,
}

struct Cache<U, V> {
    get_new_value: fn(&U) -> V,
    values: HashMap<U, V>,
}

impl<U, V> Cache<U, V>
where
    U: Eq + Hash,
{
    fn new(get_new_value: fn(&U) -> V) -> Cache<U, V> {
        Cache {
            get_new_value,
            values: HashMap::new(),
        }
    }

    fn get_value(&mut self, key: U) -> &V {
        self.values
            .entry(key)
            .or_insert_with_key(|key| (self.get_new_value)(key))
    }
}

fn parse_bool(input: &str) -> bool {
    let re = Regex::new(r"(?i)^no?$").unwrap();
    !re.is_match(input)
}

fn remove_brackets(input: &str) -> String {
    let re = Regex::new(r"\(\)$").unwrap();
    re.replace(input, "").to_string()
}

fn get_input(response: &mut String) {
    for _ in 0..3 {
        match io::stdin().read_line(response) {
            Ok(_) => return,
            Err(_) => {
                println!("Problem reading that response. Please try again.");
            }
        }
    }

    panic!("Too many failed attempts to read response");
}

fn get_answer(question: &str) -> String {
    println!("{}", question);

    let mut response = String::new();
    get_input(&mut response);

    remove_brackets(response.trim())
}

fn get_canon_path(rel_path: &str) -> PathBuf {
    current_dir()
        .expect("Couldn't get current directory; unable to continue")
        .join(rel_path)
        .canonicalize()
        .expect("Couldn't get path to requested directory; unable to continue")
}

fn search_dir(dir: &PathBuf, search_term: &str) -> Result<bool, Box<dyn std::error::Error>> {
    let dir_contents = fs::read_dir(dir)?;

    let re = "^".to_owned() + search_term + "$";
    let re = Regex::new(&re)?;

    for item in dir_contents {
        let is_name_match = item?
            .path()
            .file_stem()
            .and_then(|s| s.to_str())
            .map(|s| re.is_match(s));
        if let Some(true) = is_name_match {
            return Ok(true);
        }
    }

    Ok(false)
}

fn create_agg_dir(dir: &PathBuf, agg: &str) -> Option<PathBuf> {
    println!("Searching for existing directory for: {}", agg);

    match search_dir(dir, agg) {
        Ok(true) => {
            // TODO: Extend tool by letting you create templates for
            // individual functions in an existing directory
            println!(
                "A directory already exists for that aggregate. Add any new functions in the existing directory!"
            );
            None
        }
        Ok(false) => {
            println!("Directory not found. Creating directory...");
            let agg_dir = dir.join(agg);
            fs::create_dir(&agg_dir).expect("Failed to create new directory");
            Some(agg_dir)
        }
        Err(_) => {
            // TODO: If error is regex error and not fs error, could try
            // prompting for aggregate name once more in case of typo
            panic!("Couldn't determine for sure whether the directory already exists.");
        }
    }
}

fn get_shared_replacements(metadata: &TemplateMetadata) -> Replacements {
    let mut replacements = Replacements {
        simple_markdown: vec![(
            Regex::new(r"<AGGREGATE>").unwrap(),
            metadata.aggregate.clone(),
        )],
        yaml: vec![
            (
                Regex::new(r"<AGGREGATE NAME, INCLUDING BRACKETS>").unwrap(),
                metadata.aggregate.clone() + "()",
            ),
            (
                Regex::new(r"<BOOL>").unwrap(),
                match metadata.is_experimental {
                    true => "true".to_string(),
                    false => "false".to_string(),
                }
            ),
            (
                Regex::new(r"<LARGER CATEGORY FOR THIS FUNCTION, E.G., STATISTICAL AND REGRESSION ANALYSIS>").unwrap(),
                metadata.category.clone(),
            ),
        ]
    };

    let mut version_replacements = match metadata.is_experimental {
        true => vec![
            (
                Regex::new(r"<VERSION WHEN EXPERIMENTAL FUNCTION INTRODUCED>").unwrap(),
                metadata.version.clone(),
            ),
            (
                Regex::new(r"\n\s*stable: <VERSION WHEN STABILIZED, REMOVE IF NOT STABLE>\r?\n")
                    .unwrap(),
                "\n".to_string(),
            ),
        ],
        false => vec![
            (
                Regex::new(r"<VERSION WHEN STABILIZED, REMOVE IF NOT STABLE>").unwrap(),
                metadata.version.clone(),
            ),
            (
                Regex::new(
                    r"\n\s*experimental: <VERSION WHEN EXPERIMENTAL FUNCTION INTRODUCED>\r?\n",
                )
                .unwrap(),
                "\n".to_string(),
            ),
        ],
    };

    let mut placeholder_replacements = vec![(
        Regex::new(r"<FUNCTION NAME, INCLUDING BRACKETS>").unwrap(),
        "placeholder".to_string(),
    )];

    replacements.yaml.append(&mut version_replacements);
    replacements.yaml.append(&mut placeholder_replacements);
    replacements
}

fn get_final_replacements<'a>(
    template: &Template,
    replacements: &'a mut Replacements,
) -> &'a Vec<Replacement> {
    let Template { file_name, .. } = template;

    match template {
        Template {
            template_type: TemplateType::SimpleMarkdown,
            ..
        } => &replacements.simple_markdown,
        Template {
            template_type: TemplateType::Aggregate | TemplateType::Accessor | TemplateType::Rollup,
            ..
        } => {
            replacements.yaml.pop();
            replacements.yaml.push((
                Regex::new(r"<FUNCTION NAME, INCLUDING BRACKETS>").unwrap(),
                file_name.clone() + "()",
            ));
            &replacements.yaml
        }
    }
}

fn create_template_impl(base_template: &str, out_path: &Path, replacements: &[Replacement]) {
    let mut s = base_template.to_string();

    replacements.iter().for_each(|re| {
        s = re.0.replace(&s, &re.1).to_string();
    });

    let result = fs::write(out_path, s);
    match result {
        Ok(()) => (),
        Err(_) => {
            println!(
                "Couldn't write a template file to {}. You'll have to create the file yourself.",
                out_path.display()
            );
        }
    }
}

fn create_templates(
    templates: Vec<Template>,
    from_dir: &Path,
    to_dir: &Path,
    metadata: TemplateMetadata,
) {
    let mut cache: Cache<PathBuf, Option<String>> = Cache::new(|path| {
        let s = fs::read_to_string(path);

        match s {
            Ok(val) => Some(val),
            Err(_) => None,
        }
    });

    let mut replacements = get_shared_replacements(&metadata);

    templates.iter().for_each(|template| {
        let template_name = match template {
            Template {template_type: TemplateType::SimpleMarkdown, ..} => "intro.md",
            Template {template_type: TemplateType::Aggregate, ..} => "aggregate.md",
            Template {template_type: TemplateType::Accessor, ..} => "accessor.md",
            Template {template_type: TemplateType::Rollup, ..} => "rollup.md",
        };
        let Template{file_name, ..} = template;

        let base_template = cache.get_value(from_dir.join(template_name));
        let final_replacements = get_final_replacements(template, &mut replacements);

        match base_template {
            Some(tmpl) => create_template_impl(tmpl, &to_dir.join(file_name.to_owned() + ".md"), final_replacements),
            None => {
                println!(
                    "Error getting base template for {:?}. You'll have to create this file yourself.",
                    template
                )
            }
        };
    });
}

fn main() {
    let two_step = get_answer(
        "Are you creating a hyperfunction group that uses the two-step aggregation pattern? [Y(default) / n]"
    );
    let two_step = parse_bool(&two_step);
    if !two_step {
        println!("This tool only supports two-step hyperfunction groups for now. Sorry!");
        return;
    }

    let aggregate =
        get_answer("What is the name of the aggregate function in this group? (e.g., stats_agg)");
    let hyperfunctions_dir = get_canon_path(HYPERFUNCTIONS_DIR);
    let agg_dir = match create_agg_dir(&hyperfunctions_dir, &aggregate) {
        Some(path) => path,
        None => return,
    };

    let is_experimental = get_answer("Are these functions experimental? [Y(default) / n]");
    let is_experimental = parse_bool(&is_experimental);

    let version = get_answer("What version are these functions being introduced in?");

    let category = get_answer(
        "What larger category do these functions belong in? (e.g., percentile approximation)",
    );

    let accessors =
        get_answer("What are all the accessors in this group? List them separated by whitespace");
    let mut accessors = accessors
        .split_whitespace()
        .map(|acc| Template {
            template_type: TemplateType::Accessor,
            file_name: acc.to_string(),
        })
        .collect();

    let has_rollup = get_answer("Does this group contain a rollup? [Y(default) / n]");
    let has_rollup = parse_bool(&has_rollup);

    println!("Thanks! Creating templates...");
    let template_dir = get_canon_path(TEMPLATE_DIR);

    let mut templates_to_create = vec![
        Template {
            template_type: TemplateType::SimpleMarkdown,
            file_name: "intro".to_string(),
        },
        Template {
            template_type: TemplateType::SimpleMarkdown,
            file_name: "examples".to_string(),
        },
        Template {
            template_type: TemplateType::Aggregate,
            file_name: aggregate.clone(),
        },
    ];
    templates_to_create.append(&mut accessors);
    if has_rollup {
        templates_to_create.push(Template {
            template_type: TemplateType::Rollup,
            file_name: "rollup".to_string(),
        });
    }

    let metadata = TemplateMetadata {
        aggregate,
        category,
        is_experimental,
        version,
    };

    create_templates(templates_to_create, &template_dir, &agg_dir, metadata);

    println!("Templates created. Please fill them out and contact the docs team if you need help.");
}
