import json, argparse
from ContextMapper import ContextMapper, getVersions
from ChangeIdentifier import ChangeIdentifier

package_level = 3
comp_package_level = 2

if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument('--inputDir')
	parser.add_argument('--outputDir')
	parser.add_argument('--recovery')
	parser.add_argument('--arch1')
	parser.add_argument('--arch2')
	parser.add_argument('--layer')
	args = vars(parser.parse_args())

	clusters = set()

	with open("config/" + args['layer']) as package_names:
		packages = package_names.read().splitlines()

	for p in packages:
		print p
		clusters.update(ContextMapper('android', [args['arch1'], args['arch2']], p, args['layer'], args['recovery']))
	clusters = list(clusters)
	for c in clusters:
		if c == "dummy":
			continue
		ContextMapper('android', [args['arch1']], c, args['layer'], args['recovery'], True)
		ContextMapper('android', [args['arch2']], c, args['layer'], args['recovery'], True)
	recovered_versions = getVersions([args['arch1'], args['arch2']], args['recovery'], 'android')
	for p in packages:
		ChangeIdentifier(args['outputDir'], 'android', recovered_versions, p, args['layer'], args['recovery'], package_level)
	for v in range(2):
		for c in clusters:
			if c == "dummy":
				continue
			print c
			ChangeIdentifier(args['outputDir'], 'android', [recovered_versions[v]], c, args['layer'], args['recovery'], comp_package_level)