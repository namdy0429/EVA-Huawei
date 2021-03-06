#!/usr/bin/env python3.5
import json, argparse, os, sys
from os.path import join
sys.path.insert(1, '/Users/namdy/.pyenv/versions/anaconda-2.0.1/lib/python2.7/site-packages')

from ContextMapper import ContextMapper, getVersions
from ChangeIdentifier import ChangeIdentifier

package_level = 3
comp_package_level = 2

def generate_config(rsf_file_paths, layer, recovery_name):
	cur_dir = "/".join(os.getcwd().split("/")[:-1])
	sub_systems = set()
	for rsf_file_path in rsf_file_paths:
	    with open(join(cur_dir, "Data", "Architecture", "android", recovery_name, layer, rsf_file_path)) as f:
	        content = f.readlines()
	        content.sort()
	        for line in content:
	            if "/" in line:
	                line = line.replace("/", ".")
	            (d, label, class_name) = line.split()
	            paths = class_name.split(".")
	            sub_systems.add(paths[0]+"."+paths[1])
	return sub_systems


if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument('--inputDir')
	parser.add_argument('--recovery')
	parser.add_argument('--arch1')
	parser.add_argument('--arch2')
	parser.add_argument('--layer')
	args = vars(parser.parse_args())

	clusters = set()

	cur_dir = "/".join(os.getcwd().split("/")[:-1])
	# print(cur_dir)
	out_dir = "/".join(cur_dir.split("/")[:-1]) + "/Front-end"
	# print(out_dir)

	if not os.path.exists(cur_dir + "/Engine/config/" + args['layer']):
		configs = generate_config([args['arch1'], args['arch2']], args['layer'], args['recovery'])
		with open(cur_dir + "/Engine/config/" + args['layer'], "w") as output:
			for c in sorted(list(configs)):
				output.write(c + "\n")

	with open(cur_dir + "/Engine/config/" + args['layer']) as package_names:
		packages = package_names.read().splitlines()

	for p in packages:
		# print p
		clusters.update(ContextMapper('android', [args['arch1'], args['arch2']], p, args['layer'], args['recovery']))
	clusters = list(clusters)
	for c in clusters:
		if c == "dummy":
			continue
		ContextMapper('android', [args['arch1']], c, args['layer'], args['recovery'], True)
		ContextMapper('android', [args['arch2']], c, args['layer'], args['recovery'], True)
	recovered_versions = getVersions([args['arch1'], args['arch2']], args['recovery'], 'android')
	for p in packages:
		ChangeIdentifier(out_dir, 'android', recovered_versions, p, args['layer'], args['recovery'], package_level)
	for v in range(2):
		for c in clusters:
			if c == "dummy":
				continue
			# print c
			ChangeIdentifier(out_dir, 'android', [recovered_versions[v]], c, args['layer'], args['recovery'], comp_package_level)
	print("?&recovery=" + args['recovery'] + "&ver1=" + recovered_versions[0] + "&ver2=" + recovered_versions[1])