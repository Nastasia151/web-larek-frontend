import { IContact, IValidationResult, paymentType } from "../../types";
import { settings } from "../../utils/constants";



// дописать навешивание класса
export class UserContactsModel implements IContact {
    private userPayment: paymentType;
    private userAddress: string;
    private userEmail: string;
    private userPhone: string;

    constructor() {
        this.userPayment = "online";
        this.userAddress = '';
        this.userEmail = '';
        this.userPhone = '';
    }

    get payment(): paymentType { return this.userPayment; }
    set payment(value: paymentType) { this.userPayment = value; }

    get address(): string { return this.userAddress; }
    set address(value: string) { this.userAddress = value; }

    get email(): string { return this.userEmail; }
    set email(value: string) { this.userEmail = value; }

    get phone(): string { return this.userPhone; }
    set phone(value: string) { this.userPhone = value; }

    isValidPaymentForm(): IValidationResult {
    const isPaymentValid = !!this.userPayment; // выбран ли тип оплаты
    const isAddressValid = this.userAddress.length > 5;
    let message = '';

    if (!isPaymentValid && !isAddressValid) {
        message = 'Выберите способ оплаты и введите адрес доставки';
    } else if (!isPaymentValid) {
        message = 'Выберите способ оплаты';
    } else if (!isAddressValid) {
        message = 'Введите корректный адрес доставки';
    }

    return {
        isValid: isPaymentValid && isAddressValid,
        message,
    };
}


    // валидация контактов
    isValidContact(): IValidationResult {
    const email = this.userEmail.trim();
    const phone = this.userPhone.trim();
    const emailValid = email !== '' && this.validateEmail(email);
    const phoneValid = phone !== '' && this.validatePhone(phone);

    // Оба поля пустые
    if (email === '' && phone === '') {
        return { isValid: false, message: settings.contactsEmptyErrorMessage };
    }

    // Оба поля невалидны
    if (email !== '' && phone !== '' && !emailValid && !phoneValid) {
        return { isValid: false, message: settings.contsctcUnvalidErrorMessage };
    }

    // Email валиден, телефон пустой
    if (emailValid && phone === '') {
        return { isValid: false, message: settings.phoneEmptyErrorMessage };
    }

    // Email валиден, телефон невалиден 
    if (emailValid && phone !== '' && !phoneValid) {
        return { isValid: false, message: settings.phoneUnvalidErrorMessage };
    }

    // Телефон валиден, email пустой
    if (phoneValid && email === '') {
        return { isValid: false, message: settings.emailEmptyErrorMessage };
    }

    // Телефон валиден, email невалиден
    if (phoneValid && email !== '' && !emailValid) {
        return { isValid: false, message: settings.emailUnvalidErrorMessage };
    }

    // Оба поля валидны
    if (emailValid && phoneValid) {
        return { isValid: true, message: '' };
    }

    // На случай, если что-то не учтено
    return { isValid: false, message: 'Проверьте введённые данные' };
}


    // Вспомогательные методы
    private validateEmail(email: string): boolean {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
        return regex.test(email);
    }

    private validatePhone(phone: string): boolean {
        const regex = /^((\+7|7|8)+([0-9]){10})$/;
        return regex.test(phone);
    }

    getContact(): IContact {
        return {
            payment: this.userPayment,
            address: this.userAddress,
            email: this.userEmail,
            phone: this.userPhone
        }
    }

    clearContact() {
         this.userPayment = "online";
         this.userAddress = '';
         this.userEmail = '';
         this.userPhone = '';
    }
}