import * as ImageCacheActions from '../action-types/image-cache-action-types';

let initialState = {
  images: [

  ]
}

export default function imageCache(state=initialState, action) {
  switch(action.type) {
    case ImageCacheActions.SET_IMAGES:
      return {
        images: action.images
      }

    default:
      return state;
  }
}
