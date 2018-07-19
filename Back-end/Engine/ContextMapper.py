import json, operator, sys
import os
from datetime import datetime
import dateutil.parser
from Architecture import Architecture
import glob
from os import walk
from os.path import join
import pickle

def getVersions(file_names, recovery_name, software_name):
	recovered_versions = []
	for file in file_names:
		if recovery_name == 'relax':
			label = file.split('_'+ recovery_name)[0].split(software_name+'_')[1]
		elif recovery_name == 'acdc':
			label = file.split('_'+ recovery_name)[0].split(software_name+'-')[1]
		elif recovery_name == 'arc':
			label = "_".join(file.split('_topics')[0].split(software_name+'-')[1].split("_")[:-1])
		else:
			label = file.split('_'+ recovery_name)[0].split(software_name+'-')[1]
		recovered_versions.append(label)
	return recovered_versions

def ContextMapper(software_name, file_names, target_sub, layer, recovery_name = 'acdc', is_component_arch = False):
	cur_dir = "/".join(os.getcwd().split("/")[:-1])

	architectures = []
	for file in file_names:
		if recovery_name == 'relax':
			label = file.split('_'+ recovery_name)[0].split(software_name+'_')[1]
		elif recovery_name == 'acdc':
			label = file.split('_'+ recovery_name)[0].split(software_name+'-')[1]
		elif recovery_name == 'arc':
			label = "_".join(file.split('_topics')[0].split(software_name+'-')[1].split("_")[:-1])
		else:
			label = file.split('_'+ recovery_name)[0].split(software_name+'-')[1]
		arch = Architecture(label, target_sub, is_component_arch)
		arch.load_architecture(join(cur_dir, "Data", "Architecture", software_name, recovery_name, layer, file))
		architectures.append(arch.sort())

	recovered_versions = []
	for v in architectures:
		recovered_versions.append(v.label)

	output_dir = join(cur_dir, "Data", "Context_Architecture", software_name, recovery_name)
	if not os.path.exists(output_dir):
		os.makedirs(output_dir)
	file_name = ''
	version_name = ''
	for v in architectures:
		version_name = version_name + v.label + "_"
		file_name = file_name + v.label + "_"
	file_name += target_sub + "_"
	version_name = version_name + layer
	if not os.path.exists(output_dir + "/" + version_name):
		os.makedirs(output_dir + "/" + version_name)
	with open(output_dir + "/" + version_name + "/" + file_name + "contextualized_archs.pkl", "wb") as f:
		pickle.dump(architectures, f)
	cc = []
	for a in architectures:
		for c in a.clusters:
			cc.append(c.label)
	return cc
