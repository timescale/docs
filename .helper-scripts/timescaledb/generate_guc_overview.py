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
    "DefineCustomBoolVariable": "BOOLEAN",
    "DefineCustomIntVariable": "INTEGER",
    "DefineCustomEnumVariable": "ENUM",
    "DefineCustomStringVariable": "STRING",
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
        # sanitize data
        it = [re.sub(r"[\n\t]*", "", v).strip() for v in guc.split(",")]

        # sanitize elements
        name = re.sub(r"[\"\(\)]*", "", it[0])
        short_desc = it[1].strip("\"")
        long_desc = it[1] if it[2].lower() == "null" else re.sub(r"[\"\"]*", "", it[2].strip("\""))
        value = it[4]

        # TODO: clean up /* Value= */ from strings
        #

        # Exclude GUCs (if specified)
        if name not in EXCLUDE:
            map[name] = {
                "name": name,
                "short_desc": short_desc,
                "long_desc": long_desc,
                "value": value,
                "type": guc_type,
                "scopes": [], # assigned later during scope discovery
            }

    logging.info("registered %d GUCs of type: %s" % (len(map), guc_type))
    return map

"""
Parse GUCs and prepare them for rendering
@param content: str
@return dict
"""
def prepare(content: str) -> dict:
    map = {}

    # Find all GUCs based on patterns and prepare them in a dict
    for pattern, val in TYPES.items():
        map.update(unwrap(re.findall(r"%s\(MAKE_EXTOPTION(.*?)\);" % pattern, content, re.DOTALL), val))

    # TODO: find scopes
    # https://github.com/timescale/timescaledb/blob/2.19.x/src/guc.c#L797


    # Return dict with alphabetically sorted keys
    return {i: map[i] for i in sorted(map.keys())}

"""
Render the GUCs to file
"""
def render(gucs: dict, filename: str):
    with open(filename, "w") as f:
        f.write("| Name | Type | Short Description | Short Description | Value |\n")
        f.write("| --- | --- | --- | --- | --- |\n")
        for guc in gucs.values():
            f.write("| `%s` | `%s` | %s | %s | `%s` |\n" % (
                guc["name"], guc["type"], guc["short_desc"], guc["long_desc"], guc["value"]
            ))
    logging.info("rendering completed to %s" % filename)

"""
Main
"""
if __name__ == "__main__":
    content = get_content("https://raw.githubusercontent.com/timescale/timescaledb/refs/tags/%s/src/guc.c" % args.tag)
    logging.info("fetched guc.c file for version: %s" % args.tag)
    gucs = prepare(content)
    render(gucs, args.destination)

#    print(gucs)
