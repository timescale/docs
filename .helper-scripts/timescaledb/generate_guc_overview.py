#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Generate Overview page of available GUCs in TimescaleDB with descriptions
#
# Args: 
#   tag: tag to pull the guc.c from
#

import argparse
import requests
import re
import logging

logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s', level=logging.INFO)

parser = argparse.ArgumentParser()
parser.add_argument('tag', type=str, help='tag name to pull guc.c')
parser.add_argument('destination', type=str, help='file name to add output')
args = parser.parse_args()

TYPES = {
    "DefineCustomBoolVariable"  : "BOOLEAN",
    "DefineCustomIntVariable"   : "INTEGER",
    "DefineCustomEnumVariable"  : "ENUM",
    "DefineCustomStringVariable": "STRING",
    "DefineCustomRealVariable"  : "REAL",
}

SCOPES = {
    "PG16_GE"      : "Postgres 16 or greater",
    "TS_DEBUG"     : "Debug mode",
    "USE_TELEMETRY": "Telemetry enabled", 
}

# List of GUCs to exclude from the docs
EXCLUDE = []

"""
Fetch the guc.c content from GitHub
@param url: str
@return str
"""
def get_content(url: str) -> str:
    resp = requests.get(url=url)
    if resp.status_code != 200:
        logging.error("can not fetch: %s" % url)
        exit(10)
    return resp.text

"""
Unwrap parsed GUCs into a map with GUC name as key and the value with the 
extracted values from the GUC:
    /* name= */,
	/* short_desc= */,
    /* long_desc= */,
    /* valueAddr= */,
    /* Value= */,
    /* context= */,
    /* flags= */,
    /* check_hook= */,
    /* assign_hook= */,
    /* show_hook= */
@param gucs: list
@param guc_type: str
@return dict
"""
def unwrap(gucs: list, guc_type: str) -> dict:
    map = {}

    for guc in gucs:
        # unwrap element 
        # first split on new line, then join on ,
        lines = [re.sub(r"[\n\t]*", "", v).strip() for v in guc.split("\n")]
        it = []
        lst = []
        for line in lines:
            # ends with "," --> take all preceding values from the list
            # concatenate them with this element minus the trailing ","
            # and reset the list again
            if line[-1:] == ",":
                val = "".join(lst) + line[:-1]
                lst = []
                it.append(val)
            else:
                # add the line to the list to concatenate later
                lst.append(line)

        # sanitize elements
        name = re.sub(r"[\"\(\)]*", "", it[0])
        short_desc = sanitize_description(it[1])
        long_desc = short_desc if it[2].lower() == "null" else sanitize_description(it[2])

        # Exclude GUCs (if specified)
        if name not in EXCLUDE:
            map[name] = {
                "name"      : name,
                "short_desc": short_desc,
                "long_desc" : long_desc,
                "value"     : get_value(guc_type, it),
                "meta"      : get_meta_data(guc_type, it),
                "type"      : guc_type,
                "scopes"    : [], # assigned later during scope discovery
            }
    return map

def sanitize_description(text) -> str:
    # Remove all quotes and normalize whitespace to single line
    return strip_comment_pattern(' '.join(text.replace('"', '').split()).strip())

def strip_comment_pattern(text) -> str:
    pattern = r'/\*\s*[a-zA-Z0-9_]*=\s*\*/'
    return re.sub(pattern, '', extract_gettext_noop_string(text))

def extract_gettext_noop_string(text):
    pattern = r'gettext_noop\s*\(\s*"([^"]*(?:\\.[^"]*)*)"\s*\)'
    match = re.search(pattern, text, re.DOTALL)
    return match.group(1) if match else text

def get_value(type: str, parts: list) -> str:
    """
    Get the value of the GUC based on the type
    """
    # ENUM needs different handling, finding the struct and the strings
    # identifying the options

    # Every other type
    return strip_comment_pattern(parts[4]).strip()

def get_meta_data(type: str, parts: list) -> str:
    """
    Build any meta data if present based on the type
    """
    if type == "BOOLEAN":
        return ""
    if type in ["INTEGER", "REAL"]:
        return "min: `%s`, max: `%s`" % (strip_comment_pattern(parts[5]).strip(), strip_comment_pattern(parts[6]).strip())
    return ""

"""
Parse GUCs and prepare them for rendering
@param content: str
@return dict
"""
def prepare(content: str) -> dict:
    map = {}

    # Find all GUCs based on patterns and prepare them in a dict
    for pattern, val in TYPES.items():
        # Run twice to find variants, e.g., there is a nicer way with one regex to do this
        # but this is not time sensitive nor consuming, so we're good
        # - DefineCustomStringVariable(MAKE_EXTOPTION(
        # - DefineCustomStringVariable(/* name= */ MAKE_EXTOPTION(
        map.update(unwrap(re.findall(r"%s\(MAKE_EXTOPTION(.*?)\);" % pattern, content, re.DOTALL), val))
        map.update(unwrap(re.findall(r"%s\(\/\* name= \*\/ MAKE_EXTOPTION(.*?)\);" % pattern, content, re.DOTALL), val))

    # TODO: find scopes
    # https://github.com/timescale/timescaledb/blob/2.19.x/src/guc.c#L797
    # SCOPES

    # print summary
    summary = {}
    for v in map.values():
        if v["type"] not in summary.keys():
            summary[v["type"]] = 0
        summary[v["type"]] += 1
    for k, v in summary.items():
        logging.info("registered %d GUCs of type: %s" % (v, k))

    # Return dict with alphabetically sorted keys
    return {i: map[i] for i in sorted(map.keys())}

"""
Render the GUCs to file
"""
def render(gucs: dict, filename: str, version: str):
    with open(filename, "w") as f:
        f.write("| Name | Type | Default | Description |\n")
        f.write("| -- | -- | -- | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|\n")
        for guc in gucs.values():
            desc = guc["long_desc"]
            if guc["meta"] != "":
                desc += "<br />" + guc["meta"] 
            f.write("| `%s` | `%s` | `%s` | %s |\n" % (guc["name"], guc["type"], guc["value"], desc))
        f.write("\n")
        f.write("Version: [%s](https://github.com/timescale/timescaledb/releases/tag/%s)" % (version, version))
    logging.info("rendering completed to %s" % filename)

"""
Main
"""
if __name__ == "__main__":
    content = get_content("https://raw.githubusercontent.com/timescale/timescaledb/refs/tags/%s/src/guc.c" % args.tag)
    logging.info("fetched guc.c file for version: %s" % args.tag)
    gucs = prepare(content)
    render(gucs, args.destination, args.tag)
