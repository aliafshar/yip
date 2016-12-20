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

dev:
	make serve & watch -n 1 make build doc

doc: init
	esdoc -c etc/esdoc_conf.json

build: init
	rollup -c etc/rollup_conf.js
	cp dist/yip.js example/

init:
	mkdir -p docs dist

serve:
	# replace this with whatever server you use
	# I use one I wrote.
	127


