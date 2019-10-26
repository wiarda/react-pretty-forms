/* eslint-disable react/require-default-props */
const React = require('react');
const PropTypes = require('prop-types');

function RowBreak({ styles, rowClassName = styles.prettyRow || 'pretty-row', children }) {
  return <div className={rowClassName}>{children}</div>;
}

RowBreak._prettyType = 'RowBreak';

RowBreak.propTypes = {
  rowClassName: PropTypes.string,
  styles: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

RowBreak.defaultProps = {
  styles: {},
};

module.exports = RowBreak;
