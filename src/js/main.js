// CONTACT CLASS
class Contact {
    constructor (contactId, fname, lname, mphone, hphone, email, address) {
        this.contactId = contactId;
        this.fname   = fname;
        this.lname   = lname;
        this.mphone  = mphone;
        this.hphone  = hphone;
        this.email   = email;
        this.address = address;
    }
}

// UI CLASS
class UI {
    static contactLoader() {
        Storage.getContacts().forEach(contact => this.addContact(contact));
        this.showMoreFields();
    }

    static contactSortSections() {
        let container  = document.querySelector('.contacts-wrapper');
        let charset = ['&', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        charset.forEach(i => {
            let section = document.createElement('div');
            section.innerHTML = `
            <h3 class="separator">${i}</h3>
            <div class="sort-section"></div>`;

            container.appendChild(section);
        });
    }

    static showMoreFields() {
        let showMoreBtn = document.querySelector('.show-more-btn');

        showMoreBtn.addEventListener('click', function () {
            let optionalFields = document.querySelector('.optional-fields-wrapper');

            if (!optionalFields.classList.contains('active')) {
                showMoreBtn.firstElementChild.textContent = 'Show less fields';
                showMoreBtn.firstElementChild.classList.add('show-more-btn-active');
                this.querySelector('i').innerHTML = '&#xe316;';
                optionalFields.style.display = 'block';
                optionalFields.classList.add('active');
            } else {
                showMoreBtn.firstElementChild.textContent = 'Show more fields';
                showMoreBtn.firstElementChild.classList.remove('show-more-btn-active');
                this.querySelector('i').innerHTML = '&#xe313;';
                optionalFields.style.display = 'none';
                optionalFields.classList.remove('active');
            }
        });
    }

    static addContact(contact) {
        let contactBox = document.createElement('div');
        contactBox.className = 'contact-box';

        contactBox.innerHTML = `
        <div class="contact-box-top">
            <img class="contact-photo" src="src/img/default_avatar.jpg">
            <p class="contact-name">${contact.fname} ${contact.lname}</p>
            <i class="remove material-icons">&#xe872;</i>
        </div>
        <div class="contact-box-content">
            <input class="contact-id" type="hidden" value="${contact.contactId}">
            <div class="rows">
                <div>
                    <i class="material-icons">&#xe0cf;</i>
                    <p class="other-details">Mobile Phone</p>
                </div>
                <p class="contact-phone">${contact.mphone}</p>
            </div>
        </div>`;

        if (contact.hphone != '') {
            let row = document.createElement('div');
            row.className = 'rows';
            row.innerHTML = `
            <div>
                <i class="material-icons">&#xe0cf;</i>
                <p class="other-details">Home Phone</p>
            </div>
            <p class="contact-phone">${contact.hphone}</p>`;

            contactBox.querySelector('.contact-box-content').appendChild(row);
        }

        if (contact.email != '') {
            let row = document.createElement('div');
            row.className = 'rows';
            row.innerHTML = `
            <div>
                <i class="material-icons">&#xe0d0;</i>
                <p class="other-details">E-mail Address</p>
            </div>
            <p class="contact-phone">${contact.email}</p>`;

            contactBox.querySelector('.contact-box-content').appendChild(row);
        }

        if (contact.address != '') {
            let row = document.createElement('div');
            row.className = 'rows';
            row.innerHTML = `
            <div>
                <i class="material-icons">&#xe88a;</i>
                <p class="other-details">Home Address</p>
            </div>
            <p class="contact-phone">${contact.address}</p>`;

            contactBox.querySelector('.contact-box-content').appendChild(row);
        }

        document.querySelectorAll('.separator').forEach(i => {
            if (/^\w/.test(contact.fname.charAt(0)) &&
                contact.fname.charAt(0).toLowerCase() == i.textContent.toLowerCase()) {
                i.classList.add('in-use');
                i.style.display = 'block';
                i.nextElementSibling.appendChild(contactBox);
            } 
            else if (/^\d/.test(contact.fname.charAt(0)) && i.textContent == '#') {
                i.classList.add('in-use');
                i.style.display = 'block';
                i.nextElementSibling.appendChild(contactBox);
            }
            else if (/^\W/.test(contact.fname.charAt(0)) && i.textContent == '&') {
                i.classList.add('in-use');
                i.style.display = 'block';
                i.nextElementSibling.appendChild(contactBox);
            } 
        });
    }

    static clearOutFields() {
        let inputFields = document.querySelectorAll('[name="contactForm"] input');

        inputFields.forEach(i => i.value = '');
    }

    static removeContact(el) {
        if (el.classList.contains('remove')) {
            let remainingContacts = el.parentElement.parentElement.parentElement.childElementCount;
            let separator = el.parentElement.parentElement.parentElement.previousElementSibling;
            
            if (remainingContacts == 1) { separator.style.display = 'none'; }
            
            el.parentElement.parentElement.remove();

            Storage.removeContacts(el.parentElement.parentElement.querySelector('.contact-id').value);

            Alert.showAlertBox('Contact Deleted', 'info');
        }
    }

    static contactCardClickEvent() {
        document.querySelectorAll('.contact-box-top').forEach(i => {
            i.addEventListener('click', function () {
                let contactBox = i.parentElement;
                if (!contactBox.classList.contains('expanded')) {
                    contactBox.style.height = `${contactBox.scrollHeight}px`;
                    contactBox.classList.add('expanded');
                } else {
                    contactBox.style.height = '95px';
                    contactBox.classList.remove('expanded');
                }
            });
        });
    }
}

// LOCAL STORAGE CLASS
class Storage {
    static getContacts() {
        let contacts;

        if (!localStorage.getItem('Contacts')) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('Contacts'));
        }
        return contacts;
    }

    static setContacts(contact) {
        let contacts = this.getContacts();

        contacts.push(contact);
        contacts.sort((a, b) => (a.fname.toLowerCase() < b.fname.toLowerCase() ? -1 : 1));
        localStorage.setItem('Contacts', JSON.stringify(contacts));
    }

    static removeContacts(contactId) {
        let contacts = this.getContacts();

        contacts.forEach((contact, index) => {
            if (contact.contactId === contactId) {
                contacts.splice(index, 1);                
            }
        });
        localStorage.setItem('Contacts', JSON.stringify(contacts));
    }
}

// ALERT BOX CLASS
class Alert {
    static showAlertBox(message, className) {
        let overlay = document.createElement('div');
        overlay.classList.add('alert-overlay');

        if (document.querySelector('.alert-overlay') != null) {
            document.querySelector('.alert-overlay').remove();
        }

        overlay.innerHTML = `
        <div class="alert alert-${className}">${message}</div>`;
        document.body.appendChild(overlay);
        overlay.classList.add('overlay-show');

        setTimeout(() => {
            overlay.classList.add('overlay-hide');
        }, 3000); 
    }
}

// INPUT FILTER CLASS
class InputFilter {
    static validateInput(input, type) {
        const PHONE_REGEX = /^\(?\d{3}\)?[*.\s-]*\d{3}[*.\s-]*\d{4}$/;
        const EMAIL_REGEX = /^[a-z~!]+[a-z0-9~!._-]*@[a-z]+[.-]*\.(com|net|org|edu|gov)$/i;
        input = input.trim();
        let validated = '';

        switch (type) {
            case 'phone':
                validated = PHONE_REGEX.test(input);
                break;
        
            case 'email':
                validated = EMAIL_REGEX.test(input);
        }
        return validated;
    } 
}

// UNIQUE KEY CLASS
class UniqueKey {
    static generateKey(threshold) {
        let key = '';
        let charset = 
        ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u','U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z', '!', '@','#','$', '%', '^', '&', '*', '.', '_', ';', '?', '{', '}', '[', ']', '|', '+', '=', '<', '>', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
        for (let i = 0; i < threshold; i++) {
            let random = ((Math.random() * charset.length)).toFixed();
            key += charset[random];
        }
        return key;
    }
}



// Event: Load All Contacts
document.addEventListener('DOMContentLoaded', () => { 
    UI.contactSortSections();
    UI.contactLoader(); 
    UI.contactCardClickEvent(); 
});


// Event: Add Contact
let contactForm = document.forms['contactForm'].addEventListener('submit', function (e) {
    e.preventDefault();
    let fname  = document.forms['contactForm']['fname'].value;
    let lname  = document.forms['contactForm']['lname'].value;
    let mphone = document.forms['contactForm']['mphone'].value;

    /* Optional */
    let hphone  = document.forms['contactForm']['hphone'].value;
    let email   = document.forms['contactForm']['email'].value;
    let address = document.forms['contactForm']['address'].value;

    if (fname == '' || lname == '' || mphone == '') {
        Alert.showAlertBox('You must fill out the fields!', 'danger');
        return;
    }

    if (InputFilter.validateInput(mphone, 'phone') === false) {
        Alert.showAlertBox('Please verify the mobile phone number', 'warning');
        return;
    }

    if (hphone !== '' && InputFilter.validateInput(hphone, 'phone') === false) {
        Alert.showAlertBox('Please verify the home phone number', 'warning');
        return;
    }

    if (email !== '' && InputFilter.validateInput(email, 'email') === false) {
        Alert.showAlertBox('Please verify the email', 'warning');
        return;
    }

    let contact = new Contact(
        UniqueKey.generateKey(15), 
        fname, 
        lname, 
        mphone,
        hphone,
        email,
        address
    );

    UI.addContact(contact);

    Storage.setContacts(contact);

    UI.clearOutFields();

    Alert.showAlertBox('New Contact Added', 'success');

    setTimeout(() => window.location.reload(), 3800);
});


// Event: Remove Contact
let contactWrapper = document.querySelector('.contacts-wrapper').addEventListener('click', function (e) {
    UI.removeContact(e.target);
});


// Event: Filter Contact List
let filterInput = document.querySelector('[name="filter-input"]').addEventListener('keyup', function () {
    let contacts = document.querySelectorAll('.contact-name');
    let keyword  = this.value.toLowerCase(); 
    
    if (keyword !== '') {
        document.querySelectorAll('.separator').forEach(i => {
            if (i.classList.contains('in-use')) { 
                if (i.textContent.toLowerCase() != keyword.charAt(0)) {
                    i.style.display = 'none';
                } else {
                    i.style.display = 'block';
                }
            }
        });

        contacts.forEach(contact => {
            let contactName = contact.textContent.toLowerCase();
            if (contactName.slice(0, keyword.length) != keyword) {
                contact.parentElement.parentElement.style.display = 'none';
            } else {
                contact.parentElement.parentElement.style.display = 'block';
            }
        });
    } else {
        document.querySelectorAll('.separator').forEach(i => {
            if (i.classList.contains('in-use')) {
                i.style.display = 'block';
            }
        });
        contacts.forEach(contact => contact.parentElement.parentElement.style.display = 'block');
    }
});


let str = 'LOREM ipsum dolor sit amet, consectetur adipiscing elit. Proin nisl turpis, semper quis elementum nec, facilisis sed enim. Proin vestibulum elit quis risus tempus, eu tincidunt orci dictum. Maecenas eu luctus nisi. Phasellus enim lorem, ullamcorper pharetra justo eu, placerat interdum odio.';


function toCapitalize(text) {
    return text.toLowerCase().split(' ').map(str => str.charAt(0).toUpperCase()+str.slice(1)).join(' ');
}

let people = [
    { name: 'Adison' },
    { name: 'Amber' },
    { name: 'Carl' },
    { name: 'Ethan' },
    { name: 'Sean' },
];

console.log(people.filter(person => person.name.charAt(0).toUpperCase() == 'A'));

console.log(people.map(people => `Name: ${people.name}`).join('\n'));