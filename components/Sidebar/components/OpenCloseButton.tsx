import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconBulb,
  IconMenu,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';

interface Props {
  onClick: any;
  side: 'left' | 'right';
}

export const CloseSidebarButton = ({ onClick, side }: Props) => {
  return (
    <>
      <button
        className={`fixed top-2 ${
          side === 'right' ? 'right-[270px]' : 'left-[230px]'
        } z-50 h-7 w-7 hover:text-gray-400 sm:top-0.5 sm:${
          side === 'right' ? 'right-[270px]' : 'left-[230px]'
        } sm:h-8 sm:w-8 sm:text-neutral-700 text-[#3d3d3d] ${
          side === 'right'
            ? 'right-sidebar-toggle-button'
            : 'left-sidebar-toggle-button'
        }`}
        onClick={onClick}
      >
        {side === 'right' ? <IconX /> : <IconMenu2 />}
      </button>
      <div
        onClick={onClick}
        className="top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
      ></div>
    </>
  );
};

export const OpenSidebarButton = ({ onClick, side }: Props) => {
  return (
    <button
      className={`fixed top-2 ${
        side === 'right' ? 'right-2' : 'left-2'
      } z-50 h-7 w-7 text-black hover:text-gray-400  sm:top-02 sm:${
        side === 'right' ? 'right-2' : 'left-2'
      } sm:h-7 sm:w-7 sm:text-neutral-700 text-[#3d3d3d]`}
      onClick={onClick}
    >
      {side === 'right' ? <IconBulb /> : <IconMenu2 />}
    </button>
  );
};
