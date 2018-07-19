import os
import pickle
import re
import glob
from os import walk
from os.path import join

from Architecture import Architecture
from ChangeAnalyzer import convert_changes_to_json
from ChangeAnalyzer import get_architectural_change

import json

def find_nth(haystack, needle, n):
	start = haystack.find(needle)
	while start >= 0 and n > 1:
		start = haystack.find(needle, start+len(needle))
		n -= 1
	return start


def getPackageName(package, level):
	# print(package)
	start_idx = find_nth(package, ".", level-1)
	end_idx = find_nth(package, ".", level)
	# print start_idx
	# print end_idx
	# print len(package)
	if end_idx == -1:
		# package_name = package[start_idx+1:len(package)]
		package_name = 'leaf'
	else:
		package_name = package[start_idx+1:end_idx]
	return package_name


def ChangeIdentifier(out_dir, software_name, version_names, target_sub, layer, recovery_name='acdc', package_level=4):
	cur_dir = "/".join(os.getcwd().split("/")[:-1])
	output_dir = join(cur_dir, "Data", "Context_Architecture", software_name, recovery_name)
	file_name = ''
	version_name = ''
	for v in version_names:
		version_name = version_name + v + "_"
		file_name = file_name + v + "_"
	file_name += target_sub + "_"
	version_name = version_name + layer
	with open(output_dir + "/" + version_name + "/" + file_name + "contextualized_archs.pkl", "rb") as f:
		architectures = pickle.load(f)

	# print architectures
	version_names = []
	for v in architectures:
		version_names.append(v.label)
		v.generate_class_list()

	for i in range(len(version_names)-1):
		version = version_names[i+1]
		prev_version = version_names[i]
		for arch in architectures:
		    if arch.label == version:
		        curr_arch = arch
		    elif arch.label == prev_version:
		        prev_arch = arch
		if not curr_arch:
		    print("failed", version)
		if not prev_arch:
		    print("failed", prev_version)
		changes = get_architectural_change(prev_arch, curr_arch)

	context_data = {"name": "combined", "children": [], "package_list": [], "version_list": []}
	packages = set()

	for arch_idx in range(len(architectures)):
		arch = architectures[arch_idx]
		context_data['version_list'].append(arch.label)
		cluster_names = []
		clusters = []
		for c in arch.clusters:
			# if c.label == "dummy":
			# 	continue
			cluster_names.append(c.label)
			c_data = {"name": c.label, "change": c.change, "children": []}
			for e in c.entities:
				if arch_idx != 0:
					if e.name in architectures[arch_idx-1].classes and e.change == 4:
						# print e.name
						c_data["children"].append({"name": e.name, "ids": e.issue_ids, "titles": e.titles, "bodys": e.descs, "labels": e.labels, "change": 6, "size": 1, "version": arch.label})
						packages.add(getPackageName(e.name, package_level))
						continue
				c_data["children"].append({"name": e.name, "ids": e.issue_ids, "titles": e.titles, "bodys": e.descs, "labels": e.labels, "change": e.change, "size": 1, "version": arch.label})
				packages.add(getPackageName(e.name, package_level))
			clusters.append(c_data)
		context_data['children'].append({"name": arch.label, "children": clusters, "clusters": cluster_names, "package_level": package_level})
	context_data['package_list'] = list(packages)

	output_dir = join(out_dir, "data", software_name, recovery_name)
	# print output_dir + "/" + version_name
	if not os.path.exists(output_dir + "/" + version_name):
		os.makedirs(output_dir + "/" + version_name)
	file_name = ''
	for v in architectures:
		version_name
		file_name = file_name + v.label + "_"
	file_name += target_sub + "_"
	with open(output_dir + "/" + version_name + "/" + file_name + "processed_archs.json", "wb") as f:
		json.dump(context_data, f)
