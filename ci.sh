#!/bin/bash

dirPath='..'
nodeModulesPath=${dirPath}'/node_modules'
pjPath=${dirPath}'/package.json'

# check package.json differences
if [[ ! -f ${pjPath} || "$(diff -q 'package.json' ${pjPath})" ]]; then
	echo 'npm install...'
	npm install --registry=https://registry.npm.taobao.org	
	cp package.json ${pjPath}
	rm -rf ${nodeModulesPath}
	cp -r node_modules ${nodeModulesPath}
fi

# symlink to external node_modules path
if [[ ! -f node_modules ]]; then
	echo 'make copy...'
	cp -r ${nodeModulesPath} node_modules
fi

echo 'done'