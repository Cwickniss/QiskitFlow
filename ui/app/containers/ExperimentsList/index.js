/**
 *
 * ExperimentsList
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Table, Button, Tag, Pagination } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Link } from 'react-router-dom';
import {
  makeSelectExperimentListItems,
  makeSelectExperimentListLoading,
  makeSelectExperimentListPage, makeSelectExperimentListTotal
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getExperimentsAction } from './actions';

const expandedRowRender = record => {
  const columns = [
    {
      title: 'Run id',
      dataIndex: 'uuid',
      key: 'uuid',
      render: uuid => <Link to={`/runs/${uuid}`}>{`Run [${uuid}]`}</Link>,
    },
    {
      title: 'Metrics',
      dataIndex: 'metrics',
      key: 'metrics',
      render: metrics => {
        const metricsList = metrics.map((m, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`metric_${m.name}_${i}`}>{`${m.name}: ${m.value}`}</div>
        ));
        return <span>{metricsList}</span>;
      },
    },
    {
      title: 'Parameters',
      dataIndex: 'parameters',
      key: 'parameters',
      render: parameters => {
        const parametersList = parameters.map((p, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`param_${p.name}_${i}`}>{`${p.name}: ${p.value}`}</div>
        ));
        return <span>{parametersList}</span>;
      },
    },
    {
      title: '# measurements',
      dataIndex: 'measurements',
      key: 'measurements',
      render: measurements => measurements.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <span>
          <Button danger size="small" type="text" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={record.runs} pagination={false} />
  );
};

export function ExperimentsList({
  loading,
  page,
  total,
  items,
  getExperiments
}) {
  useInjectReducer({ key: 'experimentsList', reducer });
  useInjectSaga({ key: 'experimentsList', saga });

  useEffect(() => {
    getExperiments(1)
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, row) => <Link to={`/experiments/${row.id}`}>{name}</Link>,
    },
    {
      title: '# of runs',
      dataIndex: 'runs',
      key: 'runs',
      render: runs => runs.length,
    },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Date', dataIndex: 'created_at', key: 'created_at' },
    {
      title: 'Tags',
      key: 'tags',
      render: row => {
        const tagsList = row.tags.map((tag, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={`tags_${tag}_${i}`}>{tag}</Tag>
        ));
        return <div>{tagsList}</div>;
      },
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Experiments</title>
        <meta name="description" content="QiskitFlow. Experiments list." />
      </Helmet>
      <Table
        loading={loading}
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={items}
        pagination={
          <Pagination
            onChange={p => getExperiments(p)}
            defaultCurrent={1}
            current={page}
            total={total}
          />
        }
      />
    </div>
  );
}

ExperimentsList.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  page: PropTypes.number,
  total: PropTypes.number,
  items: PropTypes.array,
  getExperiments: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectExperimentListLoading(),
  page: makeSelectExperimentListPage(),
  total: makeSelectExperimentListTotal(),
  items: makeSelectExperimentListItems(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // eslint-disable-next-line no-undef
    getExperiments: page => dispatch(getExperimentsAction(page)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ExperimentsList);
