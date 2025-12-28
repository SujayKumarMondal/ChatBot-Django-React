import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vs2015 from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
import { Copy, Check, Smile, MessageCircle, Edit2, Trash2 } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  messageId?: string;
  onReact?: (emoji: string) => void;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  reactions?: Record<string, number>;
}

export default function Message({
  role,
  content,
  timestamp,
  messageId,
  onReact,
  onReply,
  onEdit,
  onDelete,
  reactions,
}: MessageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const isUser = role === "user";

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEdit = () => {
    if (onEdit && messageId) {
      onEdit(messageId, editedContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && messageId) {
      onDelete(messageId);
    }
  };

  return (
    <div
      className={`flex gap-3 p-4 mb-4 rounded-lg animate-fadeIn ${
        isUser
          ? "ml-auto bg-primary/10 border border-primary/20 text-foreground"
          : "bg-card border border-border text-card-foreground"
      } max-w-xl md:max-w-2xl transition-all duration-300`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
            isUser
              ? "bg-primary/20 text-primary"
              : "bg-secondary/20 text-secondary"
          }`}
        >
          {isUser ? "U" : "A"}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? "order-1" : "order-2"}`}>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 rounded bg-background text-foreground border border-border"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(content);
                }}
                className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code(props: any) {
                    const { node, inline, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const codeContent = String(children).replace(/\n$/, "");
                    const startOffset = node?.position?.start?.offset || 0;
                    const index = typeof startOffset === 'number' ? startOffset : parseInt(String(startOffset));

                    if (!inline && match) {
                      return (
                        <div className="relative group my-3 bg-background rounded-lg overflow-hidden border border-border">
                          <SyntaxHighlighter
                            style={vs2015 as any}
                            language={match[1]}
                            PreTag="pre"
                            className="!m-0 !bg-background !rounded-lg"
                            {...rest}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                          <button
                            onClick={() => handleCopyCode(codeContent, index)}
                            className="absolute top-2 right-2 p-2 rounded bg-primary/20 hover:bg-primary/30 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Copy code"
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <code
                        className="px-2 py-1 rounded bg-primary/10 text-primary"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-2">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-4">
                        <table className="border-collapse border border-border">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="border border-border bg-primary/10 p-2">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return <td className="border border-border p-2">{children}</td>;
                  },
                }}
              >
                {editedContent}
              </ReactMarkdown>
            </div>

            {/* Metadata */}
            {timestamp && (
              <div className="text-xs text-muted-foreground mt-2">
                {timestamp.toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      {showActions && !isEditing && (
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReact && messageId && (
            <button
              onClick={() => onReact && onReact("👍")}
              className="p-1.5 rounded hover:bg-primary/20 transition-colors"
              title="React"
              aria-label="Add reaction"
            >
              <Smile className="h-4 w-4" />
            </button>
          )}
          {onReply && messageId && !isUser && (
            <button
              onClick={() => onReply(messageId)}
              className="p-1.5 rounded hover:bg-primary/20 transition-colors"
              title="Reply"
              aria-label="Reply to message"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          )}
          {onEdit && messageId && isUser && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded hover:bg-primary/20 transition-colors"
              title="Edit"
              aria-label="Edit message"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && messageId && isUser && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
              title="Delete"
              aria-label="Delete message"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          )}
        </div>
      )}

      {/* Reactions */}
      {reactions && Object.keys(reactions).length > 0 && (
        <div className="flex gap-1 mt-2">
          {Object.entries(reactions).map(([emoji, count]) => (
            <button
              key={emoji}
              className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-xs"
              title={`${count} reactions`}
            >
              {emoji} {count > 1 && count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
