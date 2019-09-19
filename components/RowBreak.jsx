const React = require('react');

function RowBreak({ styles = {}, rowClassName = styles.prettyRow || 'pretty-row', children }) {
  return <div className={rowClassName}>{children}</div>;
}

RowBreak._prettyType = 'RowBreak';

module.exports = RowBreak;
