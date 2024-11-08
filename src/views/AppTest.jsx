import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import tick_img from '../assets/images/tick_ic.png';

function AppTest() {
    const [avlData, setAvlData] = useState([])
    const [userType, setUserType] = useState('1')
    const [itemData, setItemData] = useState(
        {
            itemName: '',
            quantity: '',
            unitPrice: '',
            submissionDate: new Date(),
            currency: '$'
        }
    )
    const [supplierDta, setSupplierDta] = useState([])
    const [countryOpr, setCountryOpr] = useState([])
    const [stateOpr, setStateOpr] = useState([])
    const [cityOpr, setCityOpr] = useState([])
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
        const userParams = {
            itemDetails: itemData, supplier: {
                "supplierName": supplierDta.supplierName,
                "companyName": supplierDta.companyName,
                "email": supplierDta.email,
                "phoneCode": "+91",
                "phoneNumber": supplierDta.phone,
                "countryId": supplierDta.countryId,
                "stateId": supplierDta.stateId,
                "cityId": supplierDta.cityId
            }
        }
        axios.post('https://apis-technical-test.conqt.com/Api/Item-Supplier/Save-Items-Suppliers', { ...userParams }).then((Response) => {
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
        setItemData({ ...itemData, submissionDate: e.target.value })
    }
    const handleSuppChange = (e) => {
        const { name, value } = e.target
        setSupplierDta({ ...supplierDta, [name]: value })

    }
    const handleSupSelect = (e, type) => {
        if (type == 'country') {
            setSupplierDta({ ...supplierDta, [type]: e })
            // setSupplierDta({ ...supplierDta, countryId: e.value })
            getStateDta(e.value)
        }
        else if (type == 'state') {
            setSupplierDta({ ...supplierDta, [type]: e })
            // setSupplierDta({ ...supplierDta, stateId: e.value })
            getCityDta(e.value)
        }
        else {
            setSupplierDta({ ...supplierDta, [type]: e })
            // setSupplierDta({ ...supplierDta, cityId: e.value })
        }
    }
    const getStateDta = (countryId) => {
        axios.get(`https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-SateList-By-Country?countryId=${countryId}`,).then((response) => {
            let countyList = response.data.data.stateList
            let tempArr = []
            countyList.map((item) => {
                tempArr.push({
                    label: item.name,
                    value: item.countryId
                })
            })
            setStateOpr(tempArr)

        })
    }
    const getCityDta = (state_id) => {
        console.log(state_id, 'supplierDta.stat')
        axios.get(`https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-CityList-By-Country-State?countryId=${supplierDta.country.value}&stateId=${state_id}`,)
            .then((response) => {
                let countyList = response.data.data.cityList
                let tempArr = []
                countyList.map((item) => {
                    tempArr.push({
                        label: item.name,
                        value: item.countryId
                    })
                })
                setCityOpr(tempArr)
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
                            {userType == 1 && <img src={tick_img} />}
                        </div>
                        <span>Item</span>
                    </div>
                    <div className={`check-box ${userType == 2 ? 'checked' : ''}`} onClick={() => (changeState(2))}>
                        <div className='box-withb' >
                            {userType == 2 && <img src={tick_img} />}
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
                                        <input maxLength={50} placeholder='Enter item name' name='itemName' onChange={handleChange} value={itemData.itemData}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Quantity</label>
                                        <input type='number'
                                            onKeyDown={(e) =>
                                                (e.key === 'e' || e.key === '.')
                                            }
                                            placeholder='Enter quantity' name='quantity' onChange={handleChange} value={itemData.quantity}></input>
                                        <span className='validation-txt'>Numeric value</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Unit Price</label>
                                        <input placeholder='Enter Unit Price' name='unitPrice' onChange={handleChange} value={itemData.unitPrice}></input>
                                        <span className='validation-txt'>Numeric value (USD)</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Date of Submission</label>
                                        <input type='date' minDate={new Date()} onChange={handleDateChange} value={itemData.submissionDate}></input>
                                        {/* <DatePicker minDate={new Date()} onChange={handleDateChange} value={itemData.submissionDate} /> */}
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
                                        <input placeholder='Enter Supplier Name' name='supplierName' onChange={handleSuppChange} value={supplierDta.supplierName}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Company Name</label>
                                        <input placeholder='Enter Company Name' name='companyName' onChange={handleSuppChange} value={supplierDta.companyName}></input>
                                        <span className='validation-txt'>Max 50 characters</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Country</label>
                                        <Select placeholder='Enter Country' options={countryOpr} onChange={(e) => handleSupSelect(e, 'country')}></Select>
                                        <span className='validation-txt'>Select country from the list</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>State</label>
                                        <Select placeholder='Enter Country' options={stateOpr} onChange={(e) => handleSupSelect(e, 'state')}></Select>
                                        <span className='validation-txt'>Select state from the list</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>City</label>
                                        {/* <input placeholder='Enter city' name='city' onChange={handleSuppChange} value={itemData.itemData}></input> */}
                                        <Select placeholder='Enter Country' options={cityOpr} onChange={(e) => handleSupSelect(e, 'city')}></Select>
                                        <span className='validation-txt'>Select City from the list</span>
                                    </div>
                                    <div className='input-block'>
                                        <label>Email Address</label>
                                        <input placeholder='Enter email address' name='email' onChange={handleSuppChange} value={supplierDta.email} type='email'></input>
                                        <span className='validation-txt'>Valid email format</span>
                                    </div>
                                </div>
                                <div className='row-input'>
                                    <div className='input-block'>
                                        <label>Phone</label>
                                        <input placeholder='Enter phone number' name='phone' onChange={handleSuppChange} value={supplierDta.phone} type='number'></input>
                                        <span className='validation-txt'>Enter phone number</span>
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
                    <div className='table-wrap'>
                        <div className='heading'>
                            <div className='text'>Uploaded Data</div>
                            <div className='filter'>Clear All</div>
                        </div>
                        <div>
                            <table>
                                <thead className='table-head'>
                                    <th className='check=box'>
                                        <div className='check-wrap'>
                                            <div className='box-withb' >
                                                {/* {userType == 1 && <img src={tick_img} />} */}
                                            </div>    Supplier
                                        </div>
                                    </th>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                </thead>
                                <tbody className='table-body'>
                                    <tr>
                                        <td className='check=box fw-5'>
                                            <div className='check-wrap'>
                                                <div className='box-withb' >
                                                    {/* {userType == 1 && <img src={tick_img} />} */}
                                                </div>    Olivia Rhye
                                            </div>
                                        </td>
                                        <td className='fw-5'>Olivia Rhye</td>
                                        <td>12</td>
                                        <td>Cape Town</td>
                                        <td>South Africa</td>
                                        <td>jackson.graham@example.com</td>
                                        <td>(406) 555-0120</td>
                                    </tr>
                                    <tr>
                                        <td className='check=box fw-5'>
                                            <div className='check-wrap'>
                                                <div className='box-withb' >
                                                    {/* {userType == 1 && <img src={tick_img} />} */}
                                                </div>    Olivia Rhye
                                            </div>
                                        </td>
                                        <td className='fw-5'>Olivia Rhye</td>
                                        <td>12</td>
                                        <td>Cape Town</td>
                                        <td>South Africa</td>
                                        <td>jackson.graham@example.com</td>
                                        <td>(406) 555-0120</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AppTest