"use client";

import { useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import { formatNumber } from "../../organisms/chat-bot/partials/utils/formatnumber";
import { TweetData } from "@/app/server/actions/cookie";

interface CookieTweetProps {
  tweetData: TweetData;
}

export default function CookieTweet({ tweetData }: CookieTweetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    authorUsername,
    createdAt,
    engagementsCount,
    impressionsCount,
    isQuote,
    isReply,
    likesCount,
    quotesCount,
    repliesCount,
    retweetsCount,
    smartEngagementPoints,
    text,
    matchingScore,
  } = tweetData;

  // Get first line of tweet for preview
  const firstLine = text.split("\n")[0];
  const hasMoreLines = text.includes("\n");

  return (
    <div>
      <div className="max-w-xl transition-colors hover:bg-muted/50">
        <div className="p-4">
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/${authorUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  @{authorUsername}
                </a>
                <span className="text-sm text-muted-foreground">·</span>
                <time className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <BarChart2 className="h-4 w-4" />
                      <span>{matchingScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>Matching Score</div>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                  aria-label={isExpanded ? "Collapse tweet" : "Expand tweet"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Tweet Text */}
            <div
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <p className="whitespace-pre-wrap">{text}</p>
              ) : (
                <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {firstLine}
                  {hasMoreLines && (
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      ... (click to expand)
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Engagement Stats */}
            {isExpanded && (
              <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                  <div>
                    <div>
                      <div className="flex items-center gap-1 hover:text-primary">
                        <MessageCircle className="h-4 w-4" />
                        <span>{formatNumber(repliesCount)}</span>
                      </div>
                    </div>
                    <div>Replies</div>
                  </div>

                  <div>
                    <div>
                      <div className="flex items-center gap-1 hover:text-primary">
                        <Repeat2 className="h-4 w-4" />
                        <span>{formatNumber(retweetsCount)}</span>
                      </div>
                    </div>
                    <div>Retweets</div>
                  </div>

                  <div>
                    <div>
                      <div className="flex items-center gap-1 hover:text-primary">
                        <Heart className="h-4 w-4" />
                        <span>{formatNumber(likesCount)}</span>
                      </div>
                    </div>
                    <div>Likes</div>
                  </div>

                  <div>
                    <div>
                      <div className="flex items-center gap-1 hover:text-primary">
                        <Share className="h-4 w-4" />
                        <span>{formatNumber(quotesCount)}</span>
                      </div>
                    </div>
                    <div>Quotes</div>
                  </div>
                </div>

                <div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span>{formatNumber(impressionsCount)} views</span>
                    </div>
                  </div>
                  <div>Impressions</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
