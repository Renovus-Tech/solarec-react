import React, { useState } from 'react'

import {
  CFormSelect
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css"
import i18n from '../../helpers/i18n'

export const GroupByFilter = ({ value, disabled, options, onChange }) => {

  const [val, setVal] = useState(value)

  const changeListener = (ev) => {
      onChange(ev.target.value);
      setVal(ev.target.value);
  }


	return (<>
            <CFormSelect value={val} disabled={disabled} onChange={changeListener} name="groupby" id="groupby" className='input-sm text-capitalize' data-testid="groupby">
              {options.map((option) => {
              return <option className="text-capitalize" key={option} value={option} onClick={changeListener}>
                {i18n.t(option)}
              </option>
            })}</CFormSelect>
          </>)
}

GroupByFilter.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func
}


