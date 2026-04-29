import { useState } from 'react';
import  searchUserConnections  from '../../services/userConnectionService.js';

const useCustomerSalesId = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  const fetchSalesIds = async (search = "", sortBy = "", sortOrder = "", size = 10, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        search,
        sortBy,
        sortOrder,
        size,
        page
      };
      const response = await searchUserConnections(payload);
      if (response.data) {
        setData(response.data.connections);
        setTotalElements(response.data.totalElements);
      } else {
        setError(response.data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, totalElements, error, fetchSalesIds };
};

export default useCustomerSalesId;
