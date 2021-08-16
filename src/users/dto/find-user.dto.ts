export class FindUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photo: Buffer;

  constructor(id, firstName, lastName, email, photo) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.photo = photo;
  }
}
