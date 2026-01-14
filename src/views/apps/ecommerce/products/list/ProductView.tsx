
'use client'

// Component Imports
import Grid from '@mui/material/Grid2'

import ProductLandingSettings from '../ProductLandingSettings'
import ProductCategoryList from '../category/ProductCategoryList'

const ProductView = ({ productData }: { productData?: any }) => {
    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ProductLandingSettings />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <ProductCategoryList />
            </Grid>
        </Grid>
    )
}

export default ProductView
