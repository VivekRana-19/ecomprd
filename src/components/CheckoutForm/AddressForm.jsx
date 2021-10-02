import React, { useState, useEffect} from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import {useForm, FormProvider} from 'react-hook-form';
import {commerce} from '../../lib/commerce';

import FormInput from './CustomTextField'
import {Link} from 'react-router-dom'


const AddressForm = ({checkoutToken, next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code,name]) => ({id:code,label:name}) );
    const subdivisions = Object.entries(shippingSubdivisions).map(([code,name]) => ({id:code,label:name}) );
    const options = shippingOptions.map((sO) => ({id:sO.id,label:`${sO.description} - (${sO.price.formatted_with_symbol})`}) );
    
    

    const fetchShippingCountry = async (checkoutTokenId) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
        console.log(countries);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubdivisions = async (countryCode) => {
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    useEffect(() => {
        fetchShippingCountry(checkoutToken.id);
    },[])

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    },[shippingCountry])

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    },[shippingSubdivision])

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=> next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
                    <Grid container spacing={3}>
                        <FormInput required name="firstName" label='First name'/>
                        <FormInput required name="lastName" label='Last name'/>
                        <FormInput required name="address1" label='Address'/>
                        <FormInput required name="email" label='Email'/>
                        <FormInput required name="city" label='City'/>
                        <FormInput required name="zip" label='Zip / Postal Code'/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country)=>(
                                    <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Province</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision)=>(
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <InputLabel>Shipping Option</InputLabel>
                            {/* <Select value='Kathmandu Rs 100' fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                    <MenuItem key='kathmandu' value='Kathmandu Rs 100'>Kathmandu Rs 100</MenuItem>
                            </Select> */}

                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                                ))}
                            </Select>

                            
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{display: 'flex', justifyContent:'space-between'}}>
                        <Button  component= {Link}  to="/cart" variant="outline" > Back to Cart</Button>
                        <Button  type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
