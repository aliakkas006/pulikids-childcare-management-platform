import defaults from '@/config/defaults';
import CustomError from './Error';

export const getPagination = ({
  totalItems = defaults.totalItems,
  limit = defaults.limit,
  page = defaults.page,
}) => {
  const totalPage = Math.ceil(totalItems / limit);

  const pagination = {
    page,
    limit,
    totalItems,
    totalPage,
    links: {
      self: `/activities?page=${page}&limit=${limit}`,
      first: `/activities?page=1&limit=${limit}`,
      last: `/activities?page=${totalPage}&limit=${limit}`,
      prev: page > 1 ? `/activities?page=${page - 1}&limit=${limit}` : null,
      next:
        page < totalPage ? `/activities?page=${page + 1}&limit=${limit}` : null,
    },
  };

  return pagination;
};

// Get transformed data
export const getTransformedItems = ({ items = [], selection = [] }: any) => {
  if (!Array.isArray(items) || !Array.isArray(selection))
    throw CustomError.badRequest('Invalid Arguments!');

  if (selection.length === 0) return items.map((item) => ({ ...item }));

  return items.map((item) => {
    const result: any = {};
    selection.forEach((key) => {
      result[key] = item[key];
    });

    return result;
  });
};
