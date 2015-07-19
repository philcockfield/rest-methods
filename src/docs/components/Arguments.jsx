import React from 'react';



/**
 * The parameters arguments for a method.
 */
export default class Arguments extends React.Component {
  render() {

    let { method, params } = this.props;

    console.log('params', params);


    return (
      <div className='arguments'>
        <div className='title'>{ this.props.title }</div>

        <table>
          <ArgumentRow/>
          <ArgumentRow/>
          <ArgumentRow/>

        </table>

      </div>
    );
  }
}

Arguments.defaultProps = { title: 'Arguments' };



/**
 * A single argument list item
 */
class ArgumentRow extends React.Component {
  render() {
    return (
      <tr className='argument'>
        <td className='label-outer'>
          <div className='name'>name</div>
          <div className='details'>name</div>
        </td>
        <td className='value-outer'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </td>

      </tr>
    );
  }
}
