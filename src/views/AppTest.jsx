import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
function AppTest() {
    const [avlData, setAvlData] = useState([])
    const [userType, setUserType] = useState('1')
    const [itemData, setItemData] = useState(
        {
            item_name: '',
            quantity: '',
            unit_price: '',
            date_selected: new Date()
        }
    )
    const [supplierDta, setSupplierDta] = useState([])
    const [countryOpr, setCountryOpr] = useState([])
    useEffect(() => {
        axios.get('https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-CountryList').then((response) => {
            let countyList = response.data.data.countyList
            let tempArr = []
            countyList.map((item) => {
                tempArr.push({
                    label: item.name,
                    value: item.countryId
                })
            })
            setCountryOpr(tempArr)
        })

    }, [])
    const handleSave = () => {
        axios.post('https://apis-technical-test.conqt.com/Api/Item-Supplier/Save-Items-Suppliers', { ...itemData }).then((Response) => {
            setAvlData(Response)
        })
    }
    const changeState = (inputValue) => {
        console.log(inputValue, 'inputValue')
        setUserType(inputValue)
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setItemData({ ...itemData, [name]: value })
    }
    const handleDateChange = (e) => {
        if (e.target.value < new Date()) return
        setItemData({ ...itemData, date_selected: e.target.value })
    }
    const handleSuppChange = (e) => {
        const { name, value } = e.target
        setSupplierDta({ ...supplierDta, [name]: value })

    }
    const handleSupSelect = (e, type) => {
        if (type == 'country') {
            setSupplierDta({ ...supplierDta, country: e })
            getStateDta(e.value)
        }
        else {
            setSupplierDta({ ...supplierDta, state: e })
        }
    }
    const getStateDta = (countryId) => {
        alert(34)
        axios.get(`https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-SateList-By-Country?countryId=${countryId}`,).then((response) => {
            let countyList = response.data.data.stateList
            let tempArr = []
            countyList.map((item) => {
                tempArr.push({
                    label: item.name,
                    value: item.countryId
                })
            })
            setCountryOpr(tempArr)
        })
    }
    return (
        <>
            <div className='main-wrapper'>
                <div className='header-wrap'>
                    <div className='logo-name'>
                        <div className='logo-circle'></div>
                        <div className='header-title'>
                            Inventory Management System
                        </div>
                    </div>
                    <div className='page-sel'>
                        Home
                    </div>
                </div>
                <div className='check-group'>
                    <div className={`check-box ${userType == 1 ? 'checked' : ''}`} onClick={() => (changeState(1))}>
                        <div className='box-withb' >
                            {userType == 1 && <img src="../assets/images/tick_ic.png" />}
                        </div>
                        <span>Item</span>
                    </div>
                    <div className={`check-box ${userType == 2 ? 'checked' : ''}`} onClick={() => (changeState(2))}>
                        <div className='box-withb' >
                            {userType == 2 && <img src='../assets/images/tick_ic.png' />}
                        </div>
                        <span>Supplier</span>
                    </div>
                </div>
                <div className='container'>
                    {userType == 1 ?
                        <>
                            <div className='item-title'>Item Details</div>
                            <div className='wrapper-input'>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Item Name</label>
                                        <input placeholder='Enter item name' name='item_name' onChange={handleChange} value={itemData.itemData}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Quantity</label>
                                        <input placeholder='Enter quantity' name='quantity' onChange={handleChange} value={itemData.quantity}></input>
                                        <span className='validation-txt'>Numeric value</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Unit Price</label>
                                        <input placeholder='Enter Unit Price' name='unit_price' onChange={handleChange} value={itemData.unit_price}></input>
                                        <span className='validation-txt'>Numeric value (USD)</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Date of Submission</label>
                                        <input type='date' minDate={new Date()} onChange={handleDateChange} value={itemData.date_selected}></input>
                                        {/* <DatePicker minDate={new Date()} onChange={handleDateChange} value={itemData.date_selected} /> */}
                                        <span className='validation-txt'>Format: MM/DD/YYYY</span>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className='item-title'>Supplier Details</div>
                            <div className='wrapper-input'>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Supplier Name</label>
                                        <input placeholder='Enter Supplier Name' name='supplier_name' onChange={handleSuppChange} value={itemData.itemData}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Company Name</label>
                                        <input placeholder='Enter Company Name' name='company_name' onChange={handleSuppChange} value={itemData.quantity}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Country</label>
                                        <Select placeholder='Enter Country' options={countryOpr} onChange={(e) => handleSupSelect(e, 'country')} value={supplierDta.country}></Select>
                                        <span className='validation-txt'>Select country from the list</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>State</label>
                                        <Select placeholder='Enter Country' options={countryOpr} onChange={(e) => handleSupSelect(e, 'state')} value={supplierDta.country}></Select>
                                        <span className='validation-txt'>Select state from the list</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>City</label>
                                        <input placeholder='Enter city' name='city' onChange={handleSuppChange} value={itemData.itemData}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Email Address</label>
                                        <input placeholder='Enter email address' name='email' onChange={handleSuppChange} value={itemData.quantity}></input>
                                        <span className='validation-txt'>Valid email format</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <div className='save-wrap'>
                        <div className='title'>
                            Submitted Data
                        </div>
                        <div className='disc'>
                            The data submitted by users will be displayed below
                        </div>
                        <div className='save-btn' onClick={() => handleSave()}>
                            Save Changes
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AppTest