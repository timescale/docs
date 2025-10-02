#!/usr/bin/env python3
"""
TigerData Documentation LLM Generator

This script generates a comprehensive llms-full.txt file for LLM training from 
TigerData documentation. It processes all markdown files following the page-index.js
structure and applies various transformations.

Features:
- Follows page-index.js hierarchical structure for proper ordering
- Removes frontmatter metadata and converts titles to # headers
- Replaces $VARIABLES with actual values
- Processes import statements and includes content from partial files
- Normalizes URLs (:currentVersion: → latest, relative → absolute)
- Consolidates and deduplicates link references at the end
- Clean output without metadata comments

Usage:
    python3 generate_llms_full.py

Output:
    llms-full.txt - Comprehensive documentation file for LLM training
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional


class TigerDataDocumentationGenerator:
    def __init__(self, docs_dir: str = "."):
        self.docs_dir = Path(docs_dir).resolve()
        self.pages = []
        self.link_references = {}
        self.processed_files = set()
        
        # Load variables from remote vars.js and add comprehensive mappings
        self.variables = self._load_comprehensive_variables()

    def _load_comprehensive_variables(self) -> Dict[str, str]:
        """Load comprehensive variable mappings."""
        return {
            # General Variables
            '$PRODUCT_PREFIX': 'Tiger',
            '$COMPANY': 'TigerData', 
            '$COMPANY_URL': 'https://www.tigerdata.com',
            '$PG': 'Postgres',
            
            # Pricing Variables
            '$PRICING_PLAN_CAP': 'Pricing plan',
            '$PRICING_PLAN': 'pricing plan',
            '$SCALE': 'Scale',
            '$PERFORMANCE': 'Performance', 
            '$ENTERPRISE': 'Enterprise',
            
            # Product Variables
            '$CLOUD_LONG': 'Tiger Cloud',
            '$CLOUD_SHORT': 'Tiger Cloud',
            '$LAKE_LONG': 'Tiger Lake',
            '$LAKE_SHORT': 'Tiger Lake',
            '$TIMESCALE_DB': 'TimescaleDB',
            '$PRODUCTS_ALL': 'TigerData products',
            '$PRODUCTS_CL_DB': 'Tiger Cloud and TimescaleDB',
            '$TDB_APACHE': 'TimescaleDB Apache 2 Edition',
            '$TDB_COMMUNITY': 'TimescaleDB Community Edition',
            
            # Service Variables
            '$SERVICE_LONG': 'Tiger Cloud service',
            '$SERVICE_SHORT': 'service',
            '$MST_LONG': 'Managed Service for TimescaleDB',
            '$MST_SHORT': 'MST',
            '$MST_SERVICE_SHORT': 'service',
            '$MST_SERVICE_LONG': 'service',
            '$MST_CONSOLE_SHORT': 'MST Console',
            '$CONSOLE': 'Console',
            '$CONSOLE_LONG': 'Tiger Cloud Console',
            '$CONSOLE_SHORT': 'Console',
            '$SELF_LONG': 'self-hosted TimescaleDB',
            '$SELF_SHORT': 'self-hosted TimescaleDB',
            
            # Feature Variables
            '$HYPERTABLE': 'hypertable',
            '$HYPERTABLES': 'hypertables',
            '$HYPERCORE': 'Hypercore',
            '$COLUMNSTORE': 'columnstore',
            '$ROWSTORE': 'rowstore',
            '$CHUNK': 'chunk',
            '$CHUNKS': 'chunks',
            '$COMPRESSION': 'compression',
            '$CONTINUOUS_AGG': 'continuous aggregate',
            '$CONTINUOUS_AGGS': 'continuous aggregates',
            '$CAGG': 'continuous aggregate',
            '$DATA_TIERING': 'data tiering',
            '$HIGH_AVAILABILITY': 'high availability',
            '$BACKUP': 'backup',
            '$RESTORE': 'restore',
            '$MIGRATION': 'migration',
            '$LIVESYNC': 'LiveSync',
            '$LIVESYNC_CAP': 'LiveSync',
            
            # Operation Variables  
            '$INSTALL': 'install',
            '$UPGRADE': 'upgrade',
            '$CONFIG': 'configuration',
            '$SECURITY': 'security',
            '$MONITORING': 'monitoring',
            '$TROUBLESHOOTING': 'troubleshooting',
            
            # Development Variables
            '$API': 'API',
            '$CLI': 'CLI',
            '$SDK': 'SDK',
            '$INTEGRATION': 'integration',
            '$TUTORIAL': 'tutorial',
            '$EXAMPLE': 'example',
            '$SAMPLE': 'sample',
            '$DEMO': 'demo',
            '$GUIDE': 'guide',
            '$REFERENCE': 'reference',
            '$DOCUMENTATION': 'documentation',
            '$DOCS': 'docs',
            
            # Account & Project Variables
            '$ACCOUNT_LONG': 'TigerData account',
            '$PROJECT_SHORT': 'project',
            '$JOB': 'job',
            '$SOURCE': 'source',
            '$TARGET': 'target',
            '$VPC': 'VPC',
            '$DATA_MODE': 'data mode',
            
            # Tool Variables
            '$TOOLKIT_LONG': 'TimescaleDB Toolkit',
            '$TOOLKIT_SHORT': 'Toolkit',
            '$SQL_ASSISTANT_SHORT': 'SQL Assistant',
            '$READ_REPLICA': 'read replica',
            
            # Legacy/Backwards compatibility
            '$TIGER_POSTGRES': 'TimescaleDB',
            '$POSTGRESQL': 'PostgreSQL',
            
            # Additional Variables
            '$OPS_MODE': 'operations mode',
            '$SQL_EDITOR': 'SQL editor',
            '$MST_CONSOLE_LONG': 'MST Console',
            '$POPSQL': 'PopSQL',
            '$ACCOUNT_SHORT': 'account',
            '$PROJECT_LONG': 'TigerData project',
            '$HA_REPLICA': 'high availability replica',
            '$TIME_BUCKET': 'time_bucket',
            '$BODY': 'body',
            '$__': '_',
            '$SERVICE_URL_WITH_PORT': 'service URL with port',
            '$IO_BOOST': 'IO boost',
            '$DB_NAME': 'database name',
            
            # Compound Variables (mixed case patterns)
            'Hypercore_CAP': 'Hypercore',
            'LiveSync_CAP': 'LiveSync',
            'TimescaleDB_CAP': 'TimescaleDB',
            'continuous aggregate_CAP': 'continuous aggregate',
            
            # Lowercase compound patterns
            'hypertable_CAP': 'hypertable',
            'hypertable_CAPs': 'hypertables',
            'job_CAPs': 'jobs',
            'service_CAP': 'service',
            'replica_CAP': 'replica',
            'replica_CAPs': 'replicas',
            'project_CAP': 'project',
            'mode_CAP': 'mode',
            'job_CAP': 'job',
            'columnstore_CAP': 'columnstore',
            'bucket_CAPs': 'buckets',
        }

    def parse_main_page_index(self) -> List[str]:
        """Parse the main page-index.js to get the ordered list of sections."""
        main_index_path = self.docs_dir / "page-index" / "page-index.js"
        
        if not main_index_path.exists():
            print(f"Warning: Main page index not found at {main_index_path}")
            return []
        
        try:
            with open(main_index_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract the module.exports array
            exports_match = re.search(r'module\.exports\s*=\s*\[(.*?)\];', content, re.DOTALL)
            if not exports_match:
                print("Warning: Could not find module.exports in main page index")
                return []
            
            exports_content = exports_match.group(1)
            
            # Find all the ...pageIndex spreads to get the order
            spread_pattern = r'\.\.\.(\w+PageIndex)'
            spreads = re.findall(spread_pattern, exports_content)
            
            # Map spread names to their corresponding directories
            section_mapping = {
                'gsgPageIndex': 'getting-started',
                'timescaleUsingPageIndex': 'use-timescale',
                'tutorialsPageIndex': 'tutorials',
                'integrationsIndex': 'integrations',
                'apiReferencePageIndex': 'api',
                'selfHostedPageIndex': 'self-hosted',
                'timescaleMSTPageIndex': 'mst',
                'timescaleAboutPageIndex': 'about',
                'navigationPageIndex': 'navigation',
                'migrationPageIndex': 'migrate',
                'AIPageIndex': 'ai',
            }
            
            sections = [section_mapping.get(spread) for spread in spreads if section_mapping.get(spread)]
            print(f"Found {len(sections)} ordered sections: {sections}")
            return sections
            
        except Exception as e:
            print(f"Error parsing main page index: {e}")
            return []

    def find_markdown_files_from_page_index(self, section_dir: str) -> List[Tuple[str, str]]:
        """Find markdown files from a page-index.js file in hierarchical order."""
        page_index_path = self.docs_dir / section_dir / "page-index" / "page-index.js"
        
        if not page_index_path.exists():
            print(f"Warning: Page index not found at {page_index_path}")
            return []
        
        try:
            with open(page_index_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract the module.exports array
            exports_match = re.search(r'module\.exports\s*=\s*(\[.*?\]);', content, re.DOTALL)
            if not exports_match:
                print(f"Warning: Could not parse module.exports in {page_index_path}")
                return []
            
            # Parse the JavaScript array structure
            pages = self._parse_page_structure(exports_match.group(1), section_dir)
            print(f"Found {len(pages)} pages in {section_dir}")
            return pages
            
        except Exception as e:
            print(f"Error processing {page_index_path}: {e}")
            return []

    def _parse_page_structure(self, js_array: str, section_dir: str) -> List[Tuple[str, str]]:
        """Parse JavaScript array structure to extract page hierarchy."""
        pages = []
        
        # Extract individual page objects
        # This is a simplified parser - handles basic object structures
        object_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
        objects = re.findall(object_pattern, js_array)
        
        for obj in objects:
            # Extract href
            href_match = re.search(r'href:\s*["\']([^"\']+)["\']', obj)
            if not href_match:
                continue
                
            href = href_match.group(1)
            
            # Extract title
            title_match = re.search(r'title:\s*["\']([^"\']+)["\']', obj)
            title = title_match.group(1) if title_match else href
            
            # Check if this page has children
            children_match = re.search(r'children:\s*\[(.*?)\]', obj, re.DOTALL)
            
            # Add the parent page
            url = f"https://docs.tigerdata.com/{section_dir}/{href}/"
            pages.append((url, f"{section_dir}/{href}"))
            
            # Add children if they exist
            if children_match:
                children_content = children_match.group(1)
                child_objects = re.findall(object_pattern, children_content)
                
                for child_obj in child_objects:
                    child_href_match = re.search(r'href:\s*["\']([^"\']+)["\']', child_obj)
                    if child_href_match:
                        child_href = child_href_match.group(1)
                        child_url = f"https://docs.tigerdata.com/{section_dir}/{child_href}/"
                        pages.append((child_url, f"{section_dir}/{child_href}"))
        
        return pages

    def find_markdown_file(self, relative_path: str) -> Optional[Path]:
        """Find the actual markdown file for a given relative path."""
        base_path = self.docs_dir / relative_path
        
        # Try different file extensions and index files
        candidates = [
            base_path / "index.md",
            base_path / "index.mdx", 
            base_path.with_suffix(".md"),
            base_path.with_suffix(".mdx"),
        ]
        
        # If path already has extension, try it directly
        if base_path.suffix in ['.md', '.mdx']:
            candidates.insert(0, base_path)
        
        for candidate in candidates:
            if candidate.exists() and candidate.is_file():
                return candidate
                
        return None

    def process_frontmatter_and_title(self, content: str) -> str:
        """Remove frontmatter and extract title as # header."""
        # Try to match complete frontmatter blocks first (---...--- or ---...---)
        frontmatter_match = re.match(r'^---\n(.*?)\n--+\n(.*)$', content, re.DOTALL)
        
        # If that doesn't work, try incomplete frontmatter (just starts with ---)
        if not frontmatter_match:
            frontmatter_match = re.match(r'^---\n(.*?)$', content, re.DOTALL)
            if frontmatter_match:
                # If we only found the start, treat the whole content as frontmatter to remove
                return "# API Reference\n\n"
        
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            body = frontmatter_match.group(2).lstrip()
            
            # Try to extract title from frontmatter
            title_match = re.search(r'^title:\s*(.+)$', frontmatter, re.MULTILINE)
            if title_match:
                title = title_match.group(1).strip()
                
                # Remove any existing # headers from the body and replace with our title
                lines = body.split('\n')
                processed_lines = []
                
                for line in lines:
                    # Skip any existing h1 headers
                    if line.strip().startswith('# '):
                        continue
                    processed_lines.append(line)
                
                # Join the processed content and add our title at the beginning
                processed_body = '\n'.join(processed_lines).strip()
                return f'# {title}\n\n{processed_body}'
            
            # If no title found, try api_name for API pages
            api_name_match = re.search(r'^api_name:\s*(.+)$', frontmatter, re.MULTILINE)
            if api_name_match:
                api_name = api_name_match.group(1).strip()
                
                # Remove any existing # headers from the body
                lines = body.split('\n')
                processed_lines = []
                
                for line in lines:
                    # Skip any existing h1 headers
                    if line.strip().startswith('# '):
                        continue
                    processed_lines.append(line)
                
                # Join the processed content and add API name as title
                processed_body = '\n'.join(processed_lines).strip()
                return f'# {api_name}\n\n{processed_body}'
            
            # If no title or api_name, just remove frontmatter and return body
            lines = body.split('\n')
            processed_lines = []
            
            for line in lines:
                # Skip any existing h1 headers since we don't have a title to replace them with
                if line.strip().startswith('# '):
                    continue
                processed_lines.append(line)
            
            return '\n'.join(processed_lines).strip()
        
        return content

    def replace_variables(self, content: str) -> str:
        """Replace $VARIABLES with their actual values, including pluralized forms."""
        # First handle exact matches
        for var, replacement in self.variables.items():
            content = content.replace(var, replacement)
        
        # Then handle pluralized variables (e.g., $HYPERTABLE_CAPs -> hypertables)
        import re
        def replace_pluralized(match):
            var_name = match.group(1)
            suffix = match.group(2)
            
            # Look up the base variable
            base_var = f'${var_name}'
            if base_var in self.variables:
                base_replacement = self.variables[base_var]
                # Apply simple pluralization rules
                if suffix.lower() == 's':
                    if base_replacement.endswith('y'):
                        return base_replacement[:-1] + 'ies'
                    elif base_replacement.endswith(('s', 'sh', 'ch', 'x', 'z')):
                        return base_replacement + 'es'
                    else:
                        return base_replacement + 's'
                else:
                    return base_replacement + suffix.lower()
            return match.group(0)  # Return original if no base variable found
        
        # Pattern to match $VARIABLE_CAP + suffix (like s, ed, ing, etc.)
        content = re.sub(r'\$([A-Z_]+)_CAP([a-z]+)', replace_pluralized, content)
        
        # Also handle direct pluralization like $HYPERTABLEs
        def replace_direct_plural(match):
            var_name = match.group(1)
            suffix = match.group(2)
            
            # Look up the base variable
            base_var = f'${var_name}'
            if base_var in self.variables:
                base_replacement = self.variables[base_var]
                if suffix.lower() == 's':
                    if base_replacement.endswith('y'):
                        return base_replacement[:-1] + 'ies'
                    elif base_replacement.endswith(('s', 'sh', 'ch', 'x', 'z')):
                        return base_replacement + 'es'
                    else:
                        return base_replacement + 's'
                else:
                    return base_replacement + suffix.lower()
            return match.group(0)
        
        # Pattern to match $VARIABLE + suffix
        content = re.sub(r'\$([A-Z_]+)([a-z]+)', replace_direct_plural, content)
        
        return content

    def clean_jsx_components(self, content: str) -> str:
        """Remove JSX components and tags."""
        try:
            # Remove Procedure tags (both cases)
            content = re.sub(r'<[Pp]rocedure>\s*', '', content)
            content = re.sub(r'\s*</[Pp]rocedure>', '', content)
            
            # Remove other common JSX components that don't contain useful content
            jsx_components = [
                'Highlight', 'Callout', 'Note', 'Warning', 'Tip', 'Important',
                'CodeTabs', 'CodeTab', 'TabItem', 'Tabs', 'Tab', 'Optional', 'Tag'
            ]
            
            for component in jsx_components:
                # Remove opening tags with attributes (escape the component name properly)
                # Handle both uppercase and lowercase versions
                for case_variant in [component, component.lower()]:
                    pattern = f'<{re.escape(case_variant)}[^>]*>'
                    content = re.sub(pattern, '', content, flags=re.IGNORECASE)
                    # Remove closing tags
                    pattern = f'</{re.escape(case_variant)}>'
                    content = re.sub(pattern, '', content, flags=re.IGNORECASE)
            
            return content
        except re.error as e:
            print(f"Regex error in clean_jsx_components: {e}")
            # Return content as-is if regex fails
            return content

    def normalize_url(self, url: str) -> str:
        """Normalize URLs by replacing :currentVersion: and making relative paths absolute."""
        # Replace :currentVersion: with latest
        url = url.replace(':currentVersion:', 'latest')
        
        # Convert relative paths to absolute URLs
        if url.startswith('/') and not url.startswith('//'):
            url = f'https://docs.tigerdata.com{url}'
        
        return url

    def normalize_links_in_content(self, content: str) -> str:
        """Normalize inline markdown links in content."""
        def replace_link(match):
            text = match.group(1)
            url = match.group(2)
            normalized_url = self.normalize_url(url)
            return f'[{text}]({normalized_url})'
        
        # Replace inline links [text](url)
        content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_link, content)
        return content

    def extract_link_references(self, content: str) -> str:
        """Extract link references and normalize their URLs."""
        lines = content.split('\n')
        remaining_lines = []
        
        for line in lines:
            # Match link reference definitions: [reference]: URL
            ref_match = re.match(r'^\[([^\]]+)\]:\s*(.+)$', line.strip())
            if ref_match:
                ref_name = ref_match.group(1)
                url = ref_match.group(2).strip()
                normalized_url = self.normalize_url(url)
                
                # Store in our global collection (deduplication happens automatically)
                self.link_references[ref_name] = normalized_url
            else:
                remaining_lines.append(line)
        
        # Also normalize any inline links in the remaining content
        remaining_content = '\n'.join(remaining_lines)
        return self.normalize_links_in_content(remaining_content)

    def process_imports(self, content: str, current_file_path: Path) -> str:
        """Process import statements and include content from imported files."""
        # Find all import statements (handle optional spaces before semicolon)
        import_pattern = r'^import\s+(\w+)\s+from\s+["\']([^"\']+)["\']\s*;?\s*$'
        imports = {}
        
        lines = content.split('\n')
        remaining_lines = []
        
        for line in lines:
            import_match = re.match(import_pattern, line.strip())
            if import_match:
                component_name = import_match.group(1)
                import_path = import_match.group(2)
                imports[component_name] = import_path
            else:
                remaining_lines.append(line)
        
        content = '\n'.join(remaining_lines)
        
        # Replace component usage with imported content
        for component_name, import_path in imports.items():
            # Find component usage like <ComponentName /> or <ComponentName/>
            component_pattern = f'<{re.escape(component_name)}\\s*/>'
            
            try:
                if re.search(component_pattern, content):
                    imported_content = self.load_imported_file(import_path, current_file_path)
                    
                    # Try all possible component tag variations
                    component_tags = [
                        f'<{component_name} />',
                        f'< {component_name} />',
                        f'<{component_name}/>',
                        f'< {component_name}/>'
                    ]
                    
                    replaced = False
                    for component_tag in component_tags:
                        if component_tag in content:
                            content = content.replace(component_tag, imported_content)
                            replaced = True
                            break
                    
                    if not replaced:
                        print(f"Warning: Could not find component tag for {component_name}")
                        
            except re.error as e:
                print(f"Regex error processing component {component_name}: {e}")
                # Try simple string replacement as fallback
                imported_content = self.load_imported_file(import_path, current_file_path)
                
                component_tags = [
                    f'<{component_name} />',
                    f'< {component_name} />',
                    f'<{component_name}/>',
                    f'< {component_name}/>'
                ]
                
                for component_tag in component_tags:
                    if component_tag in content:
                        content = content.replace(component_tag, imported_content)
                        print(f"Successfully replaced {component_name} using string replacement fallback")
                        break
        
        # Handle common components without explicit imports by convention
        common_components = {
            'TestingEnv': '_partials/_selfhosted_production_alert.md',
            'Prerequisites': '_partials/_prereqs-self-hosted.md',
        }
        
        for component_name, default_path in common_components.items():
            # Handle both normal and spaced component tags
            component_tags = [
                f'<{component_name} />',
                f'< {component_name} />',
                f'<{component_name}/>',
                f'< {component_name}/>'
            ]
            
            for component_tag in component_tags:
                if component_tag in content:
                    imported_content = self.load_imported_file(default_path, current_file_path)
                    content = content.replace(component_tag, imported_content)
                    print(f"Replaced {component_name} using default path: {default_path}")
        
        # Remove or replace components that don't have clear partials
        orphaned_components = ['Installation', 'Skip', 'OldCreateHypertable', 'PolicyVisualizerDownsampling', 'APIReference', 'Since2180']
        for component_name in orphaned_components:
            # Handle both normal and spaced component tags
            component_tags = [
                f'<{component_name} />',
                f'< {component_name} />',
                f'<{component_name}/>',
                f'< {component_name}/>'
            ]
            
            for component_tag in component_tags:
                if component_tag in content:
                    # Replace with descriptive text instead of removing
                    if component_name == 'Skip':
                        replacement_text = ""  # Remove Skip components entirely
                    else:
                        replacement_text = f"## {component_name}\n\nRefer to the installation documentation for detailed setup instructions."
                    content = content.replace(component_tag, replacement_text)
                    print(f"Replaced orphaned component {component_name} with descriptive text")
        
        return content

    def load_imported_file(self, import_path: str, current_file_path: Path) -> str:
        """Load content from an imported file."""
        # Handle versionContent/_partials/ paths - they map to _partials/
        if import_path.startswith('versionContent/_partials/'):
            import_path = import_path.replace('versionContent/_partials/', '_partials/')
        elif import_path.startswith('_partials/'):
            # Already correct path
            pass
        
        # Try different file extensions
        if import_path.endswith(('.mdx', '.md')):
            # If path already has extension, try both as-is and with swapped extension
            base_path = str(self.docs_dir / import_path)
            candidates = [
                Path(base_path),
                Path(base_path.replace('.mdx', '.md')),
                Path(base_path.replace('.md', '.mdx'))
            ]
        else:
            # Try both extensions
            candidates = [
                self.docs_dir / f"{import_path}.mdx",
                self.docs_dir / f"{import_path}.md"
            ]
        
        for file_path in candidates:
            
            if file_path.exists():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        imported_content = f.read()
                    
                    # Process the imported file recursively
                    imported_content = self.process_frontmatter_and_title(imported_content)
                    imported_content = self.replace_variables(imported_content)
                    imported_content = self.extract_link_references(imported_content)
                    imported_content = self.process_imports(imported_content, file_path)
                    imported_content = self.clean_jsx_components(imported_content)
                    
                    return imported_content.strip()
                    
                except Exception as e:
                    print(f"Error reading imported file {file_path}: {e}")
                    return f"[Error loading {import_path}]"
        
        print(f"Warning: Could not find imported file: {import_path}")
        return f"[Could not find {import_path}]"

    def process_markdown_file(self, file_path: Path, url: str) -> Optional[str]:
        """Process a single markdown file."""
        if file_path in self.processed_files:
            return None
        
        self.processed_files.add(file_path)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Process the content step by step
            content = self.process_frontmatter_and_title(content)
            content = self.replace_variables(content)
            content = self.extract_link_references(content)
            content = self.process_imports(content, file_path)
            content = self.clean_jsx_components(content)
            
            # Create the page entry
            page_content = f"===== PAGE: {url} =====\n\n{content.strip()}"
            return page_content
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None

    def generate_fallback_documentation(self) -> List[str]:
        """Generate documentation from all markdown files as fallback."""
        print("Generating fallback documentation from all markdown files...")
        
        fallback_pages = []
        
        # Find all markdown files
        for md_file in self.docs_dir.rglob("*.md"):
            if self.should_exclude_file(md_file):
                continue
                
            # Generate URL from file path
            rel_path = md_file.relative_to(self.docs_dir)
            url_path = str(rel_path.with_suffix(''))
            
            if rel_path.name == 'index':
                url_path = str(rel_path.parent)
                
            url = f"https://docs.tigerdata.com/{url_path}/"
            
            page_content = self.process_markdown_file(md_file, url)
            if page_content:
                fallback_pages.append(page_content)
        
        # Also find .mdx files
        for mdx_file in self.docs_dir.rglob("*.mdx"):
            if self.should_exclude_file(mdx_file):
                continue
                
            rel_path = mdx_file.relative_to(self.docs_dir)
            url_path = str(rel_path.with_suffix(''))
            
            if rel_path.name == 'index':
                url_path = str(rel_path.parent)
                
            url = f"https://docs.tigerdata.com/{url_path}/"
            
            page_content = self.process_markdown_file(mdx_file, url)
            if page_content:
                fallback_pages.append(page_content)
        
        return fallback_pages

    def should_exclude_file(self, file_path: Path) -> bool:
        """Check if a file should be excluded from processing."""
        exclude_patterns = [
            'deprecated',
            'OLD_',
            'old_',
            'archive',
            'draft',
            'template',
            '.template',
            'test',
            'example',
            'sample',
        ]
        
        path_str = str(file_path).lower()
        return any(pattern.lower() in path_str for pattern in exclude_patterns)

    def generate_documentation(self) -> str:
        """Generate the complete documentation."""
        print("Starting TigerData documentation generation...")
        
        # Get ordered sections from main page index
        ordered_sections = self.parse_main_page_index()
        
        all_pages = []
        
        if ordered_sections:
            # Process sections in order
            for section in ordered_sections:
                print(f"\nProcessing section: {section}")
                section_pages = self.find_markdown_files_from_page_index(section)
                
                for url, relative_path in section_pages:
                    md_file = self.find_markdown_file(relative_path)
                    if md_file:
                        page_content = self.process_markdown_file(md_file, url)
                        if page_content:
                            all_pages.append(page_content)
                    else:
                        print(f"Warning: Could not find markdown file for {relative_path}")
        
        # Add fallback documentation for any missed files
        fallback_pages = self.generate_fallback_documentation()
        all_pages.extend(fallback_pages)
        
        print(f"\nGenerated {len(all_pages)} total pages")
        print(f"Collected {len(self.link_references)} unique link references")
        
        # Combine all pages
        content = '\n\n\n'.join(all_pages)
        
        # Add consolidated link references at the end
        if self.link_references:
            content += '\n\n\n===== LINK REFERENCES =====\n\n'
            for ref_name, url in sorted(self.link_references.items()):
                content += f'[{ref_name}]: {url}\n'
        
        return content

    def save_documentation(self, content: str, output_file: str = "llms-full.txt"):
        """Save the generated documentation to a file."""
        output_path = self.docs_dir / output_file
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"\nDocumentation saved to: {output_path}")
            print(f"File size: {output_path.stat().st_size / (1024*1024):.1f}MB")
            
            # Count lines
            line_count = len(content.split('\n'))
            print(f"Lines: {line_count:,}")
            
        except Exception as e:
            print(f"Error saving documentation: {e}")


def main():
    """Main function to generate the documentation."""
    print("TigerData Documentation LLM Generator")
    print("=" * 50)
    
    # Create generator instance
    generator = TigerDataDocumentationGenerator()
    
    # Generate documentation
    content = generator.generate_documentation()
    
    # Save to file
    generator.save_documentation(content)
    
    print("\nGeneration complete!")


if __name__ == "__main__":
    main()