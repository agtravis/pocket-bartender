# App Functionality

## on landing

When the page loads, the liquor cabinet is filled with ingredients from local storage.

## local storage

Local storage only consists of an array of items the user has added. The array only contains one of each item, no duplicates.

## to fill the liquor cabinet

The user searches in the search bar for an ingredient. If successful, a modal container pops up. This box will have a button where the user can add the item to their inventory, or they can click other buttons to show recipes, perhaps facts, gifs, etc. If user already has in inventory or changes status (86'd), the button changes value and action:

    if (liquorCabinet.includes('item')) {
        //button action - some code
        //button display - some code
    } else {
        //reverse above code
    }

_Modal container - pop up? animate in from off screen?_

## filling the liquor cabinet

Images (at a fixed height) will populate the cabinet. These images are from the API.

_what will happen when liquor cabinet is full - overflow?_

## Click on a bottle in the cabinet

When a user clicks on a bottle, same modal container as the search appears. User can say they are 86'd this item (removes from cabinet & local storage), and the same buttons.

## How to display information?

_Pop up windows? Animated tabs?_

## additional APIS

YouTube for recipes? Giphy for 'loading/shaking' images? google maps for liquor stores near me?

# Tasks to get MVP

_task like this means must be done as a group_

1. landing page, implementing CSS framework, _layout_
1. _background image / color scheme_
1. HTML for landing page
1. Landing page responsive
1. HTML for modal containers
1. Basic CSS required for functioning
1. _ID names required for JavaScript/jQuery - list and define_
1. jQuery for animation/pop-up
1. Local Storage and Initialization code
1. _ID names required for back-end - list and define_
1. AJAX
1. _At a minimum designate HTML space for further API(s) response material_

Otherwise task can be assigned to an individual

# Going further

1. CSS for fine-tuning
1. Further API work
