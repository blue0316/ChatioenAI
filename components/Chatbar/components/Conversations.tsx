import { Conversation } from '@/types/chat';

import { ConversationComponent } from './Conversation';

import { before } from 'node:test';

interface Props {
  conversations: Conversation[];
  favorite: boolean;
}

export const Conversations = ({ conversations, favorite }: Props) => {
  //Make Date
  const now = new Date();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const beforeAweekDay = new Date(today);
  beforeAweekDay.setDate(today.getDate() - 7);
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations.filter((conversation) => {
        let lastUsedDate = new Date(conversation.lastUsedDate);

        return (
          !conversation.folderId &&
          lastUsedDate.getDate() == now.getDate() &&
          lastUsedDate.getMonth() == now.getMonth() &&
          lastUsedDate.getFullYear() == now.getFullYear()
        );
      }).length !== 0 && (
        <div className="ml-5 text-black" style={{ fontSize: '12px' }}>
          Today
        </div>
      )}
      {conversations
        .filter((conversation) => {
          let lastUsedDate = new Date(conversation.lastUsedDate);

          return (
            !conversation.folderId &&
            lastUsedDate.getDate() == now.getDate() &&
            lastUsedDate.getMonth() == now.getMonth() &&
            lastUsedDate.getFullYear() == now.getFullYear()
          );
        })
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent key={index} conversation={conversation} />
        ))}
      {conversations.filter((conversation) => {
        let lastUsedDate = new Date(conversation.lastUsedDate);

        return (
          !conversation.folderId &&
          lastUsedDate.getDate() == yesterday.getDate() &&
          lastUsedDate.getMonth() == yesterday.getMonth() &&
          lastUsedDate.getFullYear() == yesterday.getFullYear()
        );
      }).length !== 0 && (
        <div className="ml-5 text-black" style={{ fontSize: '12px' }}>
          Yesterday
        </div>
      )}

      {conversations
        .filter((conversation) => {
          let lastUsedDate = new Date(conversation.lastUsedDate);

          return (
            !conversation.folderId &&
            lastUsedDate.getDate() == yesterday.getDate() &&
            lastUsedDate.getMonth() == yesterday.getMonth() &&
            lastUsedDate.getFullYear() == yesterday.getFullYear()
          );
        })
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent key={index} conversation={conversation} />
        ))}

      {conversations.filter((conversation) => {
        let lastUsedDate = new Date(conversation.lastUsedDate);

        return (
          !conversation.folderId &&
          lastUsedDate.getDate() == beforeAweekDay.getDate() &&
          lastUsedDate.getMonth() == beforeAweekDay.getMonth() &&
          lastUsedDate.getFullYear() == beforeAweekDay.getFullYear()
        );
      }).length !== 0 && (
        <div className="ml-5 text-black" style={{ fontSize: '12px' }}>
          Previous 7 Days
        </div>
      )}
      {conversations
        .filter((conversation) => {
          let lastUsedDate = new Date(conversation.lastUsedDate);

          return (
            !conversation.folderId &&
            lastUsedDate.getDate() == beforeAweekDay.getDate() &&
            lastUsedDate.getMonth() == beforeAweekDay.getMonth() &&
            lastUsedDate.getFullYear() == beforeAweekDay.getFullYear()
          );
        })
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent key={index} conversation={conversation} />
        ))}
    </div>
  );
};
