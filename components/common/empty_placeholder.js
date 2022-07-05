import {UploadIcon} from '@heroicons/react/outline'

export default function EmptyPlaceholder({t}) {
  return (
      <div className='bg-gray-100 w-64 h-64 flex justify-center items-center flex-col text-gray-400'>
          <UploadIcon className='icon-base mb-4'/>
          <div>{t('upload placeholder art')}</div>
          <div>jpg / png / gif / mp4</div>
      </div>
  )
}
