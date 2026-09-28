const STORAGE_KEY = 'aura-trainees-v1'

export const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export const STATUSES = [
  { value: 'training', label: 'In Training' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'hired', label: 'Hired' },
]

export const emptyTrainee = {
  name: '',
  from: '',
  livingIn: '',
  englishLevel: 'B1',
  communication: 5,
  skills: [],
  shortIntro: '',
  experience: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
  qrLink: '',
  status: 'training',
  notes: '',
}

export function loadTrainees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* corrupted storage -> fall back to seed */ }
  return seed
}

export function saveTrainees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const seed = [
  {
    id: 't1', name: 'Abdelrahman Alhayek', from: 'Palestine', livingIn: 'Spain',
    englishLevel: 'B2', communication: 7,
    skills: ['Business', 'Communication', 'Project Management'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
  {
    id: 't2', name: 'Mohamed Shublaq', from: 'Palestine / Egypt', livingIn: '',
    englishLevel: 'B2', communication: 7,
    skills: ['Engineering', 'Problem Solving'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
  {
    id: 't3', name: 'Ahmed Alnono', from: 'Palestine', livingIn: 'Gaza',
    englishLevel: 'B1', communication: 6,
    skills: ['Technology', 'Teamwork'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
  {
    id: 't4', name: 'Mervat AlBhaisi', from: 'Palestine', livingIn: '',
    englishLevel: 'B1', communication: 6,
    skills: ['Design', 'Creativity'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
  {
    id: 't5', name: 'Ahmed Aghaalkurdi', from: 'Palestine', livingIn: 'Spain',
    englishLevel: 'B2', communication: 7,
    skills: ['Engineering', 'Remote Tools'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
  {
    id: 't6', name: 'Leonard de Lima', from: 'São Paulo, Brazil', livingIn: 'São Paulo, Brazil',
    englishLevel: 'B1', communication: 6,
    skills: ['Business', 'Technology'],
    shortIntro: '', experience: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '', qrLink: '', status: 'training', notes: '',
  },
]
