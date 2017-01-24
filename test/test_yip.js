

mocha.setup('bdd');
var expect = chai.expect;
var should = chai.should();

describe('Element', function() {

  describe('regiser', function() {
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

});
