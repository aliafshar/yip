# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

dev: build
	127 docs

esdoc: init
	rm -rf src/mdc
	esdoc -c etc/esdoc_conf.json -f umd
	make mdc

jsdoc: init
	rm -rf docs
	jsdoc -R README.md -d docs -c etc/jsdoc_conf.js src/yip.js 

mdc:
	rm -rf src/mdc
	cp -R ../material-components-web/build src/mdc

build: init jsdoc demos tester
	rollup -c etc/rollup_conf.js > dist/yip.js
	# Babel is broken for CustomElements
	# TODO fix
	# babel --presets es2015-script src/yip.js > dist/yip.js
	#uglifyjs dist/yip.js > dist/yip.min.js
	cp dist/yip.js docs/demo/
	cp dist/yip.js docs/test/

init:
	mkdir -p docs dist

demos: jsdoc
	rm -rf docs/demo
	mkdir docs/demo
	cp -R demo/* docs/demo/

tester:
	rm -rf docs/test
	mkdir docs/test
	cp test/* docs/test/
	cp third_party/* docs/test/

deploy: build demos
	cp etc/firebase_conf.json firebase.json
	firebase deploy --project yipjs-7c3d2
	rm firebase.json

serve:
	127 docs


