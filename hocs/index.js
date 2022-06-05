import withPageView from 'hocs/view'
import withForm from 'hocs/form'
import withPageList from 'hocs/list'
import withPageListAll from 'hocs/list_all'
import withTranslate from 'hocs/translate'
import withMustLogin from 'hocs/mustlogin'
import withDropdown from 'hocs/dropdown'
import withLoginUser from 'hocs/login_user'

module.exports ={
    'withPageView' : withPageView,
    'withPageList' : withPageList,
    'withPageListAll' : withPageListAll,
    'withForm'     : withForm,
    'withTranslate' : withTranslate,
    'withMustLogin' : withMustLogin,
    'withDropdown'  : withDropdown,
    'withLoginUser' : withLoginUser
}   