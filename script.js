const memberForm = document.querySelector('#member-form');
const editForm = document.querySelector('#edit-form');
const userList = document.querySelector('#user-list');
const exitBtn = document.querySelector('.btn-exit');
const formHeader = document.querySelector('.form-header');

const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');


let inputs = [];
let changed = '';

const validateName = input => {
    if(input.value.trim() === '') {
        setError(input, 'Du måste ange ett namn');
        return false;
    } else if (input.value.trim().length < 2) {
        setError(input, 'Ditt namn behöver innehålla minst två bokstäver');
        return false;
    } else {
        setSuccess(input);
        return true;
    }
}

const validateEmail = input => {
    let regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (inputs.some(user => user.email === input.value)){
        setError(input, 'Mailen finns redan registrerad');
        return false;
    } else if (!regEx.test(input.value)) {
        setError(input, 'Du måste ange en giltig emailadress');
        return false;
    } else {
        setSuccess(input);
        return true;
    }
}

const validate = input => {
    if  (input.type === 'text') return validateName(input)
    else if (input.type === 'email') return validateEmail(input)
}

const addUser = () => {    

    let user = {
        id: Date.now().toString(),
        firstName: document.querySelector('#first-name').value,
        lastName: document.querySelector('#last-name').value,
        email: document.querySelector('#email').value,
    }    

    inputs.push(user);
}

const showUser = () => {
    userList.innerHTML = '';
    inputs.forEach(input => {
      userList.innerHTML += `
        <li class="member-output" id="${input.id}">
            <div class="name-output">
                <h3 class="name">${input.firstName.toLowerCase()} ${input.lastName.toLowerCase()}</h3>
                <a href="#" class="email">${input.email}</a>
            </div>
            <div>      
            <button class="btn" id="btn-edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn" id="btn-remove"><i class="fas fa-trash-alt"></i></button>
            </div>
        </li>
      `;      
    })

    document.querySelector('.member-nr').innerText = 'Totalt antal medlemmar: ' + inputs.length
}

const editModeOn = (id) => {
    formHeader.innerText = 'Redigera medlem'
    memberForm.classList.add('d-none');
    editForm.classList.remove('d-none');
    exitBtn.classList.remove('d-none');

    inputs.forEach(user => {
        if (user.id === id) {
            document.querySelector('#edit-first-name').value = user.firstName
            document.querySelector('#edit-last-name').value = user.lastName
            document.querySelector('#edit-email').value = user.email
            
            changed = id;
        }
    })

}

const editModeOff = () => {
    for (const currentUser of inputs) {
        if(currentUser.id === changed){
            currentUser.firstName = document.querySelector('#edit-first-name').value
            currentUser.lastName = document.querySelector('#edit-last-name').value
            currentUser.email = document.querySelector('#edit-email').value
        }
    }
    clearForm();    
    showUser();
    setStartForm();
}

const setError = (input, errorMessage) => {
    const parent = input.parentElement;

    parent.classList.add('is-invalid');
    parent.classList.remove('is-valid');
    parent.querySelector('.invalid-text').innerText = errorMessage;
}

const setSuccess = (input) => {
    const parent = input.parentElement;

    parent.classList.add('is-valid');
    parent.classList.remove('is-invalid');
}

const clearForm = () => {
    document.querySelectorAll('.input').forEach(input => {
        input.value = '';
        input.parentElement.classList.remove('is-valid');
    })  
    firstName.focus();
}

const setStartForm = () => {
    formHeader.innerText = 'Bli medlem'
    memberForm.classList.remove('d-none');
    editForm.classList.add('d-none');
    exitBtn.classList.add('d-none');
}


memberForm.addEventListener('submit', e => {
    e.preventDefault();

    const errors= [];

    for (let i = 0; i < memberForm.length; i++) {
        errors[i] = validate(memberForm[i])
    }

    if (!errors.includes(false)){
        addUser();
        showUser();
        clearForm();
    }

})

userList.addEventListener('click', e => {
    const memberOutputID = e.target.parentNode.parentElement.parentElement.id;
    
    if (e.target.parentElement.id === 'btn-remove') {        
        inputs = inputs.filter(user => user.id !== memberOutputID);
        showUser();
        setStartForm();

    } else if (e.target.parentElement.id === 'btn-edit') editModeOn(memberOutputID);     
    
})

editForm.addEventListener('submit', e => {
    e.preventDefault();
    editModeOff();
})

exitBtn.addEventListener('click', setStartForm)