var modal;

var fiLogo;
var fiCompanyName;
var fiPhone;
var fiEmail;
var fiDirection;
var fiSite;
var fiVk;
var fiOk;
var fiFacebook;
var fiInstagram;
var fiYoutube;
var fiDirector;


var logoInput;
var deleteLogoElement;

var partnerLogoData = null;
const noLogoImage = "images/no_logo.png";

window.addEventListener('load', function () {
    
    modal = document.getElementById('modal-form-add-partner');

    fiLogo = document.getElementById('partner-logo');
    fiCompanyName = modal.querySelector("input[name='company_name']");
    fiPhone = modal.querySelector("input[name='phone']");
    fiEmail = modal.querySelector("input[name='email']");
    
    fiDirection = modal.querySelector("select[name='direction']");
    fiSite = modal.querySelector("input[name='site']");
    fiVk = modal.querySelector("input[name='vk']");
    fiOk = modal.querySelector("input[name='ok']");
    fiFacebook = modal.querySelector("input[name='facebook']");
    fiInstagram = modal.querySelector("input[name='instagram']");
    fiYoutube = modal.querySelector("input[name='youtube']");
    fiDirector = modal.querySelector("input[name='director']");

    checkRequiredText(fiVk);
    checkRequiredText(fiOk);
    checkRequiredText(fiFacebook);
    checkRequiredText(fiInstagram);
    checkRequiredText(fiYoutube);

    logoInput = document.getElementById('image-input');
    deleteLogoElement = document.getElementById('delete-logo');
    logoInput.addEventListener('change', selectImage);

    const submitBtn = modal.querySelector("input[name='submit-btn']");
    submitBtn.addEventListener('click', addPartner);
})

// Открытие и закрытие модального окна
function openAndCloseModal(element){
    let parentModal;
    if(typeof element != "string")
        parentModal = element.closest(".modal");
    else
        parentModal = document.getElementById(element);

    if (parentModal.classList.contains('modal_active')) 
    {
        parentModal.classList.remove("modal_active");
        parentModal.style.display='none';

        if(parentModal==modal)
            setInitialDataInForm(modal, fiLogo);
    }
    else {
        parentModal.classList.add("modal_active");
        parentModal.style.display='grid';
    }
}


// Удаление выбранного пользователем изображения
function deleteLogo(){
    logoInput.value = '';
    fiLogo.src = noLogoImage;
    deleteLogoElement.style.visibility = 'hidden';
    fiLogo.classList.remove("modal__partner-logo_selected");
}


// Вставка обязательной строки в начало текстового поля
function checkRequiredText(elem){
    let requiredText = elem.getAttribute("requiredText");
    if(requiredText)
    {
        if (String(elem.value).indexOf(requiredText) == -1) {
            elem.value = requiredText;
        }
    }
}

// Импорт изображения 
function selectImage(e){
    const file = e.target.files[0];


    /*
    // Проверка формата файла, после его выбора

    const allowedExtensions = /(\.png|\.jpeg)$/i;
    const isValidExtension = allowedExtensions.test(file.name);

    if (!isValidExtension) {
      alert('Пожалуйста, выберите изображение формата .png или .jpeg!');
      return;
    }
    */

    const reader = new FileReader();

    reader.onload = function (evt) {
        partnerLogoData = evt.target.result;

        openAndCloseModal('preview-import-image');
        let previewImgBlock = document.getElementById('preview-import-image');
        let previewImg = previewImgBlock.getElementsByClassName("modal__preview-import-image-block-img")[0];
        previewImg.src = partnerLogoData;
    };

    reader.readAsDataURL(file);
}

function addFromPreviewLogo(element){
    openAndCloseModal(element);
    fiLogo.src = partnerLogoData;
    fiLogo.classList.add("modal__partner-logo_selected")
    deleteLogoElement.style.visibility = 'visible';
}


// Инициализация формы
function setInitialDataInForm(){
    deleteLogo();
    fiDirection.value = null;

    let textInputs = [...modal.querySelectorAll('input')]
        .filter(el => el.type == 'text' || el.type == 'tel' || el.type == 'email')
    
    textInputs.forEach(input => {
        input.value = '';
        if(input.getAttribute("requiredText"))
            checkRequiredText(input);
    });
}

// Добавление нового партнера
function addPartner(e){
    let form = modal.querySelectorAll('form')[0];
    if (form && !form.checkValidity())
        return;

    //e.preventDefault();
    let newPartner = new Partner();

    newPartner.logo = partnerLogoData; 
    newPartner.nameOfCompany = fiCompanyName.value;
    newPartner.phone = fiPhone.value;
    newPartner.email = fiEmail.value;
    newPartner.direction = fiDirection.options[fiDirection.selectedIndex].text;
    newPartner.site = fiSite.value;
    newPartner.vk = fiVk.value;
    newPartner.ok = fiOk.value;
    newPartner.facebook = fiFacebook.value;
    newPartner.instagram = fiInstagram.value;
    newPartner.youtube = fiYoutube.value;
    newPartner.director = fiDirector.value;

    // И далее должна происходить отправка newPartner
}

class Partner {
    constructor(logo, nameOfCompany, phone, email, direction, site, vk, ok, facebook, instagram, youtube, director) {
        this.logo = logo;
        this.nameOfCompany = nameOfCompany;
        this.phone = phone;
        this.email = email;
        this.direction = direction;
        this.site = site;
        this.vk = vk;
        this.ok = ok;
        this.facebook = facebook;
        this.instagram = instagram;
        this.youtube = youtube;
        this.director = director;
    }
}


/* Add phone mask */
function addPhoneMask(element){
    const input = element.value.replace(/\D/g, '');
    console.log(input)
    if (input.length > 0) {
        let formattedInput = '+7 ';
        if (input.length == 1) {
            formattedInput += `(${input.substring(1, 4)}`;
        }
        if (input.length > 1) {
            formattedInput += `(${input.substring(1, 4)}`;
        }
        if (input.length > 4) {
            formattedInput += `) ${input.substring(4, 7)}`;
        }
        if (input.length > 7) {
            formattedInput += `-${input.substring(7, 9)}`;
        }
        if (input.length > 9) {
            formattedInput += `-${input.substring(9, 11)}`;
        }
        element.value = formattedInput;
    }
}
function setInitialPhoneValue(element){
    if(element.value.length==0)
        element.value="+7 (";
}
function formatPhoneNumber(phoneNumber) {
    const match = phoneNumber.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!match) return '';
    const [, plus, part1, part2, part3, part4] = match;
    let formattedNumber = '';
    if (plus) formattedNumber += '+';
    if (part1) formattedNumber += `(${part1}`;
    if (part2) formattedNumber += `) ${part2}`;
    if (part3) formattedNumber += `-${part3}`;
    if (part4) formattedNumber += `-${part4}`;
    return formattedNumber;
}