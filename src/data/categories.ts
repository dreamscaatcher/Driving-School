import type { Category } from '../types/question'

export const CATEGORIES: Category[] = [
  { id: 'Priority & Intersections', label: 'Priority & Intersections', icon: '🚦', color: 'bg-red-500',     description: 'Right of way, junctions and traffic light rules' },
  { id: 'Traffic Signs',            label: 'Traffic Signs',            icon: '🛑', color: 'bg-orange-500',  description: 'Mandatory, warning and informational signs' },
  { id: 'Vehicle Handling',         label: 'Vehicle Handling',         icon: '🔧', color: 'bg-yellow-500',  description: 'Braking forces, cornering and vehicle dynamics' },
  { id: 'Speed & Stopping',         label: 'Speed & Stopping',         icon: '⏱️', color: 'bg-lime-500',    description: 'Stopping distances, speed limits and reaction time' },
  { id: 'Motorway',                 label: 'Motorway',                 icon: '🛣️', color: 'bg-green-500',   description: 'Motorway rules, lanes and emergency procedures' },
  { id: 'Urban Driving',            label: 'Urban Driving',            icon: '🏙️', color: 'bg-teal-500',    description: 'Town and city driving rules' },
  { id: 'Environment',              label: 'Environment',              icon: '🌿', color: 'bg-cyan-500',    description: 'Eco driving, emissions and environmental impact' },
  { id: 'Vulnerable',               label: 'Vulnerable Road Users',    icon: '🚶', color: 'bg-sky-500',     description: 'Pedestrians, cyclists and motorcyclists' },
  { id: 'Rural Roads',              label: 'Rural Roads',              icon: '🌾', color: 'bg-blue-500',    description: 'Country roads, animals and rural hazards' },
  { id: 'Mixed Scenarios',          label: 'Mixed Scenarios',          icon: '🔀', color: 'bg-indigo-500',  description: 'Combined hazard and scenario questions' },
  { id: 'Night Driving',            label: 'Night Driving',            icon: '🌙', color: 'bg-violet-500',  description: 'Headlights, visibility and night hazards' },
  { id: 'Weather & Traction',       label: 'Weather & Traction',       icon: '🌧️', color: 'bg-purple-500',  description: 'Rain, ice, snow and traction control' },
  { id: 'Vehicle Maintenance',      label: 'Vehicle Maintenance',      icon: '🔩', color: 'bg-fuchsia-500', description: 'Tyres, brakes, lights and fluid checks' },
  { id: 'Emergencies',              label: 'Emergency Situations',     icon: '🚨', color: 'bg-rose-500',    description: 'Breakdowns, accidents and first aid basics' },
  { id: 'Road Safety',              label: 'Road Safety',              icon: '👁️', color: 'bg-red-400',     description: 'Observation, hazard perception and attitude' },
  { id: 'Parking',                  label: 'Parking & Stopping',       icon: '🅿️', color: 'bg-orange-400',  description: 'Parking rules, restrictions and safe stopping' },
  { id: 'Overtaking & Lane Use',    label: 'Overtaking & Lane Use',    icon: '↔️', color: 'bg-amber-500',   description: 'Safe overtaking and correct lane discipline' },
  { id: 'Driver Fitness',           label: 'Driver Fitness',           icon: '💊', color: 'bg-teal-400',    description: 'Alcohol, drugs, fatigue and medical fitness' },
  { id: 'Vehicle Knowledge',        label: 'Vehicle Knowledge',        icon: '⚙️', color: 'bg-sky-400',     description: 'Controls, dashboard and vehicle systems' },
  { id: 'Driver Behaviour',         label: 'Driver Behaviour',         icon: '😤', color: 'bg-blue-400',    description: 'Road rage, courtesy and responsible driving' },
]

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find(c => c.id === id)
