import { cn } from "@/lib/utils";
import React from "react";

export const SecurityShield = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={cn("", className)}
    >
      <rect width="26" height="26" fill="#F5F5F5" />
      <g clip-path="url(#clip0_1957_28144)">
        <rect
          width="1512"
          height="5147"
          transform="translate(-446 -2031)"
          fill="white"
        />
        <rect
          x="-20.9355"
          y="-77.0991"
          width="318"
          height="376"
          rx="12"
          fill="white"
        />
        <g clip-path="url(#clip1_1957_28144)">
          <rect
            x="-4"
            y="-3"
            width="33"
            height="33"
            fill="url(#pattern0_1957_28144)"
          />
        </g>
      </g>
      <defs>
        <pattern
          id="pattern0_1957_28144"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1957_28144" transform="scale(0.0111111)" />
        </pattern>
        <clipPath id="clip0_1957_28144">
          <rect
            width="1512"
            height="5147"
            fill="white"
            transform="translate(-446 -2031)"
          />
        </clipPath>
        <clipPath id="clip1_1957_28144">
          <rect width="26" height="26" fill="white" />
        </clipPath>
        <image
          id="image0_1957_28144"
          width="90"
          height="90"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADzUlEQVR4nO2dTWxNQRTHf5WglAUr2pBYIb4TwcZnsMHCRizEQlAk2KAWWAhBwkK6sCAsKkSsJeJjQaiPIMSGShdKRdASrVIiI5OcxUu89/r63tyZue+eX/Lf3N6+e84/07nnzZx7C4qiKIqiKIqiKMp/DAUmAYuBjcBB4DTQAlwDHgCvgHagW9QLGFFvzvF2ObdVfrdFPuugfPZiuZa9ZlUyFlgINAIngMvAPeA98DfHNF/6K9e2MVySmBolRhtr9IwAFgDbgGbgNvAxgJGmQn2U2Jsll/mSW1BqgZ3AI+BPBCaZhGRzewzslpy90gC8iMAE41kvJHcvDAeeR5C0CaTn4kHi7I4gWRNYu3wY/TiCRE1gPfRh9I8IEjWBZWv4xAmdpIlEajRqNKFHoY5oiptwA9gMTAbqRFOALcBNNbryEfQaWFTCZGgXjdp0RFOWyXeAMYO449hFobs6dTDokTwYk3PNfqNzNCUbvbSC2slOI3ozpLQbX6Xc0qqDAY221UU+hslC/QegEzgux/KxVY1mQKNtCZeP43nOPVbgXFv6aR1NcRNGFTDvQ55z7bF82M9QoyluQiFcne9KiRMqAaNGq9GJoCManTpy0TkanaNLwlUPRz+wD6gneew1muSaLmK3HiRObv9bJWrCP02OYu/xEWyXo2Dr8U+9o9g/+wjW1TJkKFzEbjtXE8d2Ymbd6Ds+Ar2qRnPFh9H5VtGyNqKP+gh0kxqNfYogceap0cz1YbRtWf2V4anjZ5GdHec8zLDRrT6DPZxho4/6DHZuho1e5DPYGnmMLGtGd4V4VvFMBo0+GyLglRk0enmIgGtkcSUrRrcBQ0IFvStDRu8IGDOjgW8pWo9uKDPWr0Uae7xxKkU7LPvLjPUkEdBQ5vZWv5gd+55hT6C/vrwcqmDuM5HrABFhX7XwNgJTjGO9A0YSGRsiMMY41noipEa69U2V6LrkFCX2pvElApOMg3aC8UTO2giMMhVqHSnhQgRmmTJ1nhRRK69TMynTkxirjIEYB3REYJ4pUZ0+35fkmjkOmyJNgrLf/maRcpYDfRGYWUg2tmVUCStkm95EJrv2sYoqY7WjfhBX+iUxVSVLKli/dqnvshVX1UwLXI3Yp21nkxEmAk8D1ckTyBi1wDmPJl9M45cRl2xPuPzrk1cUK8BU4FkCJr8EZqrD/7cDHwF+O6qPD/tsr00jM6Q1tlyT7wPTQyeRJtbIP0ko1eAOeeQh2l2R2KeTvbLjUcjgT8AeXy/PrnbqpDppla6hbnnesVF+piiKoiiKoiiKolAm/wBD78EKefbjAgAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
});
