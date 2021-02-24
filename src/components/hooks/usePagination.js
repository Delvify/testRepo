import React, { useState, useCallback } from 'react';
import {getQuery, updateQuery} from "../../utils/stringHelper";

const usePagination = (props) => {
  const query = getQuery(props);

  const [page, setPage] = useState(parseInt(query.p) || 1);

  const goToPage = useCallback((page) => {
    setPage(page);
    updateQuery(props, { p: page });
  }, [props]);

  return {
    page,
    goToPage,
  }
};

export default usePagination;
