

mocha.setup('bdd');
var expect = chai.expect;
var should = chai.should();



let _elementCounter = 100;

function _element(_builder) {
  _elementCounter++;
  console.log(_elementCounter);
  class _TestElement extends yip.Element {
    yipBuild() {
      _builder(this);
    }
  }
  const name = 'test-element-' + _elementCounter;
  console.log(name);
  yip.register(name, _TestElement);
  return document.createElement(name);
}

function _eltest(name, f) {
  return it(name + function() { return _elementCounter }(), f);
}


describe('Element', function() {

  describe('regiser', function() {


    _element

    it('store attr', function() {
      class _TestElement extends yip.Element {
        yipBuild() {
          this.testAttr = 123;
        }
      }
      const r = yip.register('test-element-0', _TestElement)
      const el = document.createElement('test-element-0');
      expect(123).to.equal(el.testAttr);
    });
  });

  describe('build', function() {

    it('element', function() {
      class _TestElement extends yip.Element {
        yipBuild() {
          this.yipAddElement('button');
        }
      }
      const r = yip.register('test-element-1', _TestElement)
      const el = document.createElement('test-element-1');
      expect('BUTTON').to.equal(el.yipNode.tagName);
    });

    it('template', function() {
      class _TestElement extends yip.Element {
        yipBuild() {
          this.yipAdd('<button></button>');
        }
      }
      const r = yip.register('test-element-2', _TestElement)
      const el = document.createElement('test-element-2');
      expect('BUTTON').to.equal(el.yipNode.tagName);
    });

  });

  describe('slot', function() {

    it('template', function() {
      class _TestElement extends yip.Element {
        yipBuild() {
          this.yipAdd('<button><slot></slot></button>');
        }
      }
      const r = yip.register('test-element-3', _TestElement)
      const el = document.createElement('test-element-3');
      expect(el.yipSlot).to.be.ok;
    });

    it('element', function() {
      class _TestElement extends yip.Element {
        yipBuild() {
          this.yipAddElement('button');
        }
      }
      const r = yip.register('test-element-4', _TestElement)
      const el = document.createElement('test-element-4');
      expect(el.yipSlot).to.be.ok;
    });

    it('children', function() {
      const el = _element((e) => {
        e.yipAdd('<button><slot></slot></button>');
      });
      const d = document.createElement('div');
      el.append(d);
      expect(el.yipChildren[0].tagName).to.equal('DIV');
    });

  });

  describe('styles', function() {
  
    it('link', function() {
      const el = _element((e) => {
        e.yipAddStyleLink('banana.css');
      });
      expect(el.yipRoot.querySelector('link').getAttribute('href')
        ).to.equal('banana.css');
    });
  
  });


});
