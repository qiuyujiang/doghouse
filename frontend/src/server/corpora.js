import utils from '@/utils'

const doghouse = {
    retrieve (data) {
        return utils.ajax({
            method: 'POST',
            url: '/apis/doghouse/v1/doghouse',
            headers:{'Content-Type':'application/json;charset=utf-8'},
            data: data
        })
    }
}

export default doghouse;