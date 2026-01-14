import CaseStudyList from '@/views/apps/casestudy/list/CaseStudyList'

import { getServerMode } from '@core/utils/serverHelpers'

const Page = () => {
    const mode = getServerMode()

    return <CaseStudyList mode={mode} />
}

export default Page
