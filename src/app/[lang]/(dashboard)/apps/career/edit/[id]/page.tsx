// MUI Imports
// Component Imports
import CareerForm from '@views/apps/career/add/CareerForm'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const CareerEdit = async ({ params }: { params: { id: string } }) => {
    // Vars
    const data = await getEcommerceData()
    // Find the specific career item. Adjust finding logic if API returns list differently.
    // Assuming data.careers is the array
    const careerData = data?.careers?.find((item: any) => item.id == params.id)

    return <CareerForm initialData={careerData} id={params.id} />
}

export default CareerEdit
