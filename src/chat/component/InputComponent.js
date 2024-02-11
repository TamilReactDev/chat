import React from 'react'
import { Alert, Form } from 'react-bootstrap'

import { TiTick } from 'react-icons/ti';
import { MdClose } from 'react-icons/md'


const InputComponent =React.forwardRef(({label,type,placeholder,id,onBlur,onFocus,onChange,focus,atertText,state,isValid},ref) => {
    return (
        <Form.Group>
            <label htmlFor={id}>{label}{' '}<span style={{ color: 'red',fontSize:'20px' }}>*</span></label>
            <div className={`input-container ${isValid && state && 'valied'}`} >
                <input type={type} required value={state}  ref={ref} onChange={(e) => onChange(e)} id={id} placeholder={placeholder} onBlur={onBlur} onFocus={onFocus}></input>
                {isValid && <TiTick style={{ color: 'lawngreen' }} />}
                {(!isValid && state) && <MdClose style={{ color: 'red' }} />}
            </div>
            <Alert className='w-100' variant='dark' show={state && !isValid && focus ? true : false}>
               {atertText}
            </Alert>
        </Form.Group>
    )
})

export default InputComponent