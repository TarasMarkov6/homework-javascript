import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const title = 'Game Over!'
    const body = fighter + ' is win!'
    console.log(body);
    showModal({title:title,bodyElement:body});
}
