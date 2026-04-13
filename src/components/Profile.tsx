import React from 'react';
import { getValidationError } from '../utils/validation';

interface ProfileProps {
  name: string;
  description: string;
  avatar: string;
  onEditProfile: () => void;
  onEditAvatar: () => void;
  onAddPlace: () => void;
}

interface EditProfileProps {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  currentName: string;
  currentDescription: string;
}

interface EditProfileState {
  nameError: string;
  descriptionError: string;
  isFormValid: boolean;
}

interface AvatarProps {
  onClose: () => void;
  onSave: (url: string) => void;
}

interface AvatarState {
  urlError: string;
  isFormValid: boolean;
}

interface AddPlaceProps {
  onClose: () => void;
  onSave: (name: string, link: string) => void;
}

interface AddPlaceState {
  nameError: string;
  linkError: string;
  isFormValid: boolean;
  name: string;
  link: string;
}

interface DeleteConfirmProps {
  onClose: () => void;
  onConfirm: () => void;
}

class DeleteConfirmPopup extends React.Component<DeleteConfirmProps> {
  render() {
    return (
      <div className="popup popup_type_remove-card popup_is-animated popup_is-opened">
        <div className="popup__content">
          <button type="button" className="popup__close" onClick={this.props.onClose}></button>
          <h3 className="popup__title">Вы уверены?</h3>
          <form className="popup__form" onSubmit={(e) => { e.preventDefault(); this.props.onConfirm(); }}>
            <button type="submit" className="button popup__button">Да</button>
          </form>
        </div>
      </div>
    );
  }
}

// Profile
class Profile extends React.Component<ProfileProps> {
  render() {
    const { name, description, avatar, onEditProfile, onEditAvatar, onAddPlace } = this.props;
    return (
      <section className="profile page__section">
        <div
          className="profile__image"
          onClick={onEditAvatar}
          style={{ backgroundImage: `url(${avatar})`, cursor: 'pointer' }}
        ></div>
        <div className="profile__info">
          <h1 className="profile__title">{name}</h1>
          <button type="button" className="profile__edit-button" onClick={onEditProfile}></button>
          <p className="profile__description">{description}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
      </section>
    );
  }
}

// EditProfile
class EditProfile extends React.Component<EditProfileProps, EditProfileState> {
  private nameInput = React.createRef<HTMLInputElement>();
  private descInput = React.createRef<HTMLInputElement>();

  constructor(props: EditProfileProps) {
    super(props);
    this.state = {
      nameError: "",
      descriptionError: "",
      isFormValid: false
    };
  }

  componentDidMount() {
    if (this.nameInput.current && this.descInput.current) {
      this.nameInput.current.value = this.props.currentName;
      this.descInput.current.value = this.props.currentDescription;
    }
  }

  handleValidation = () => {
    const nameInput = this.nameInput.current;
    const descInput = this.descInput.current;
    
    let nameError = getValidationError(nameInput);
    let descriptionError = getValidationError(descInput);
    
    const isChanged = 
      nameInput?.value !== this.props.currentName ||
      descInput?.value !== this.props.currentDescription;
    
    this.setState({
      nameError,
      descriptionError,
      isFormValid: nameError === "" && descriptionError === "" && isChanged
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.isFormValid && this.nameInput.current && this.descInput.current) {
      this.props.onSave(this.nameInput.current.value, this.descInput.current.value);
    }
  };

  render() {
    return (
      <div className="popup popup_type_edit popup_is-animated popup_is-opened">
        <div className="popup__content">
          <button type="button" className="popup__close" onClick={this.props.onClose}></button>
          <h3 className="popup__title">Редактировать профиль</h3>
          <form className="popup__form" name="edit-profile" onSubmit={this.handleSubmit}>
            <label className="popup__label">
              <input
                ref={this.nameInput}
                type="text"
                className="popup__input popup__input_type_name"
                placeholder="Имя"
                onInput={this.handleValidation}
              />
              <span className="popup__error">{this.state.nameError}</span>
            </label>
            <label className="popup__label">
              <input
                ref={this.descInput}
                type="text"
                className="popup__input popup__input_type_description"
                placeholder="Занятие"
                onInput={this.handleValidation}
              />
              <span className="popup__error">{this.state.descriptionError}</span>
            </label>
            <button type="submit" className="button popup__button" disabled={!this.state.isFormValid}>
              Сохранить
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// Avatar
class Avatar extends React.Component<AvatarProps, AvatarState> {
  private urlInput = React.createRef<HTMLInputElement>();

  constructor(props: AvatarProps) {
    super(props);
    this.state = {
      urlError: "",
      isFormValid: false
    };
  }

  handleValidation = () => {
    const urlInput = this.urlInput.current;
    let urlError = getValidationError(urlInput);
    this.setState({
      urlError,
      isFormValid: urlError === ""
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.isFormValid && this.urlInput.current) {
      this.props.onSave(this.urlInput.current.value);
    }
  };

  render() {
    return (
      <div className="popup popup_type_edit-avatar popup_is-animated popup_is-opened">
        <div className="popup__content">
          <button type="button" className="popup__close" onClick={this.props.onClose}></button>
          <h3 className="popup__title">Обновить аватар</h3>
          <form className="popup__form" name="edit-avatar" onSubmit={this.handleSubmit}>
            <label className="popup__label">
              <input
                ref={this.urlInput}
                type="url"
                className="popup__input popup__input_type_avatar"
                placeholder="Ссылка на картинку"
                onInput={this.handleValidation}
              />
              <span className="popup__error">{this.state.urlError}</span>
            </label>
            <button type="submit" className="button popup__button" disabled={!this.state.isFormValid}>
              Сохранить
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// AddPlacePopup Component
class AddPlacePopup extends React.Component<AddPlaceProps, AddPlaceState> {
  constructor(props: AddPlaceProps) {
    super(props);
    this.state = {
      nameError: "",
      linkError: "",
      isFormValid: false,
      name: "",
      link: ""
    };
  }

  validateName = (value: string): string => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) return "Пустое поле";
    if (trimmedValue.length < 2) return "Минимальное количество символов: 2";
    if (trimmedValue.length > 30) return "Максимум 30 символов";
    const pattern = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
    if (!pattern.test(trimmedValue)) {
      return "Только буквы, дефис и пробелы";
    }
    return "";
  };

  validateLink = (value: string): string => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) return "Пустое поле";
    const urlPattern = /^https?:\/\/.+\.\S+$/;
    if (!urlPattern.test(trimmedValue)) {
      return "Введите корректный URL (http:// или https://)";
    }
    return "";
  };

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const nameError = this.validateName(name);
    const linkError = this.state.linkError;
    this.setState({
      name,
      nameError,
      isFormValid: nameError === "" && linkError === "" && name.trim() !== "" && this.state.link.trim() !== ""
    });
  };

  handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    const linkError = this.validateLink(link);
    const nameError = this.state.nameError;
    this.setState({
      link,
      linkError,
      isFormValid: nameError === "" && linkError === "" && this.state.name.trim() !== "" && link.trim() !== ""
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.isFormValid) {
      this.props.onSave(this.state.name.trim(), this.state.link.trim());
      this.setState({ name: "", link: "", nameError: "", linkError: "", isFormValid: false });
    }
  };

  render() {
    return (
      <div className="popup popup_type_new-card popup_is-animated popup_is-opened">
        <div className="popup__content">
          <button type="button" className="popup__close" onClick={this.props.onClose}></button>
          <h3 className="popup__title">Новое место</h3>
          <form className="popup__form" onSubmit={this.handleSubmit}>
            <label className="popup__label">
              <input
                type="text"
                className="popup__input popup__input_type_card-name"
                placeholder="Название"
                value={this.state.name}
                onChange={this.handleNameChange}
                required
                minLength={2}
                maxLength={30}
              />
              <span className="popup__error" style={{ color: '#FF0000', opacity: 1 }}>{this.state.nameError}</span>
            </label>
            <label className="popup__label">
              <input
                type="url"
                className="popup__input popup__input_type_url"
                placeholder="Ссылка на картинку"
                value={this.state.link}
                onChange={this.handleLinkChange}
                required
              />
              <span className="popup__error" style={{ color: '#FF0000', opacity: 1 }}>{this.state.linkError}</span>
            </label>
            <button 
              type="submit" 
              className={`button popup__button ${!this.state.isFormValid ? 'popup__button_disabled' : ''}`}
              disabled={!this.state.isFormValid}
            >
              Создать
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export { Profile, EditProfile, Avatar, AddPlacePopup, DeleteConfirmPopup };