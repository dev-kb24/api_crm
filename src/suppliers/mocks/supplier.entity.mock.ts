import {
  Address,
  Coordonnees,
  Informations,
  Legal,
  Supplier_contact,
  Suppliers,
} from '@prisma/client';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

const informationsMock: Informations = {
  type_supplier: true,
  society_name: 'society name',
  site_web: 'site web',
};

const supplier_contactMock: Supplier_contact = {
  principal_contact: true,
  firstname: 'test',
  lastname: 'test',
  email: 'email@email.fr',
  phone: '0303030303',
  mobile: '0606060606',
  fonction: 'test',
};

const legalMock: Legal = {
  status: 'test status',
  siret: 'test siret',
  siren: 'test siren',
  naf: 'test naf',
  capital: 'test capital',
  rcs: 'test rcs',
  tva: '5.5',
};

const addressMock: Address = {
  name_address: 'address 1',
  street: 'street',
  city: 'city',
  zip: 'zip',
};

const coordonneesMock: Coordonnees = {
  phone: '0303030303',
  email: 'email@email.fr',
  mobile: '0606060606',
  adress: [addressMock],
};

export const supplierEntityMock: Suppliers = {
  suppliersId: '1234567891234567',
  raisonSocial: 'raison_social',
  note: 'test note',
  informations: informationsMock,
  coordonnees: coordonneesMock,
  supplier_contact: [supplier_contactMock],
  legal: legalMock,
};

export const expectedSupplierEntityMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
  note: 'test note',
  informations: informationsMock,
  coordonnees: coordonneesMock,
  supplier_contact: [supplier_contactMock],
  legal: legalMock,
};

export const createSupplierDtoMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
  note: 'test note',
  informations: informationsMock,
  coordonnees: coordonneesMock,
  supplier_contact: [supplier_contactMock],
  legal: legalMock,
};

export const updateSupplierDtoMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
  note: 'test note',
  informations: informationsMock,
  coordonnees: coordonneesMock,
  supplier_contact: [supplier_contactMock],
  legal: legalMock,
};
