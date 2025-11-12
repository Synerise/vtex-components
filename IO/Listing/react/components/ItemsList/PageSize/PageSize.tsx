import React from 'react'

import { Select } from '../../UI'
import { useListingContext } from '../../../context'

export function PageSize() {
  const { pageSize, setPageSizeHandler } = useListingContext()

  return (
    <Select
      id="itemsPerPageSelect"
      label="Items per page"
      selectHandler={setPageSizeHandler}
      options={[{ value: '12' }, { value: '24' }, { value: '48' }]}
      value={pageSize}
    />
  )
}
