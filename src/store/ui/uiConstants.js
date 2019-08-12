import CalculatorModal from '../../components/modals/CalculatorModal';
import HistoryModal from '../../components/modals/HistoryModal';
import InfoModal from '../../components/modals/InfoModal';
import ProjectsModal from '../../components/modals/ProjectsModal';

export const MODAL_TYPES = {
  CALCULATOR: 'calculator',
  HISTORY: 'history',
  INFO: 'info',
  PROJECTS: 'projects'
};

export const MODAL_INFOS = {

  [MODAL_TYPES.CALCULATOR]: {
    content: CalculatorModal,
    title: 'Calculator'
  },

  [MODAL_TYPES.HISTORY]: {
    content: HistoryModal,
    title: 'Game History'
  },

  [MODAL_TYPES.INFO]: {
    content: InfoModal,
    title: 'TM Tracker'
  },

  [MODAL_TYPES.PROJECTS]: {
    content: ProjectsModal,
    title: 'Projects'
  }

};
