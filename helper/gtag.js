import {getConfig} from 'helper/config'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  if (window.gtag) {
    let GA_TRACKING_ID = getConfig('GA_TRACKING_ID');
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
 
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action, category, label = null, value = null) => {

  if (window.gtag) {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
  }
  
}
