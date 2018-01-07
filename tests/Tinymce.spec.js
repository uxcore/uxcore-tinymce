import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Tinymce from '../src/Tinymce';
import util from '../src/util';

describe('Tinymce', () => {
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  // afterEach(() => {
  //     ReactDOM.unmountComponentAtNode(div);
  //     document.body.removeChild(div);
  // });
  it('content', done => {
    let Dome = createClass({
      render() {
        return (
          <div>
            <Tinymce ref="mce" content="这里是内容" />
          </div>
        );
      },
    });
    const instance = ReactDOM.render(<Dome />, div);
    const mceNode = instance.refs.mce;
    expect(ReactDOM.findDOMNode(mceNode).innerHTML).to.be('这里是内容');
    done();
  });
  it('props', done => {
    let Dome = createClass({
      getInitialState() {
        return {};
      },
      setProps (content, placeholder) {
        this.setState({
          content,
          placeholder,
        });
      },
      render() {
        return (
          <div>
            <Tinymce ref="mce" placeholder={this.state.placeholder} content={this.state.content} />
          </div>
        );
      },
    });
    const instance = ReactDOM.render(<Dome />, div);
    const mceNode = instance.refs.mce;
    instance.setProps('设置了新的内容', '设置了新的placeholder');
    expect(ReactDOM.findDOMNode(mceNode).getAttribute('placeholder')).to.be(
      '设置了新的placeholder'
    );
    expect(ReactDOM.findDOMNode(mceNode).innerHTML).to.be('设置了新的内容');
    done();
  });

  it('placeholder', done => {
    let Dome = createClass({
      
      render() {
        return (
          <div>
            <Tinymce ref="mce" placeholder="placeholder" />
          </div>
        );
      },
    });
    const instance = ReactDOM.render(<Dome />, div);
    const mceNode = instance.refs.mce;
    expect(ReactDOM.findDOMNode(mceNode).getAttribute('placeholder')).to.be(
      'placeholder'
    );
    done();
  });
  
  it('setTinymceContent', done => {
    let initWillRun = false;
    let Dome = createClass({
      render() {
        return (
          <div>
            <Tinymce
              ref="mce"
              content="init setTinymceContent"
              onInit={(e, editor) => {
                initWillRun = true;
                expect(true).to.be(initWillRun);
                mceNode.setTinymceContent('<div>call setTinymceContent</div>');
                expect(editor.getContent()).to.be('<div>call setTinymceContent</div>');
                mceNode.resetValue('<div>call resetValue</div>');
                setTimeout(() => {
                  expect(editor.getContent()).to.be('<div>call resetValue</div>');
                  done();
                }, 500);
              }}
            />
          </div>
        );
      },
    });
    const instance = ReactDOM.render(<Dome />, div);
    const mceNode = instance.refs.mce;
  });
  
  
  it('has tinymce', done => {
    let Dome = createClass({
      render() {
        return (
          <div>
            <Tinymce
              ref="mce"
              content="这里是内容"
              onInit={() => {
                expect(window.tinymce).to.be.an('object');
                done();
              }}
            />
          </div>
        );
      },
    });
    ReactDOM.render(<Dome />, div);
  });
  
  it('isEqual', done => {
    expect(util.isEqual({ a: '1' }, { a: '1' })).to.be(true);
    done();
  });
});
