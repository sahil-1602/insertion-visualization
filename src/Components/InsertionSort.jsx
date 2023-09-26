import React, { useEffect, useState } from 'react';
import './InsertionSort.css';

export default function InsertionSort() {
  const [array, setArray] = useState([83, 6, 63, 84, 9, 14, 90, 24, 17]);
  const [animations, setAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swapDetails, setSwapDetails] = useState({});
  let animationSpeed = 500;

  useEffect(() => {
    let tempArr = [...array];
    let animationsArray = [];
    for (let i = 1; i < tempArr.length; i += 1) {
      for (let j = i; j > 0; j -= 1) {
        if (tempArr[j - 1] > tempArr[j]) {
          animationsArray.push([j - 1, j]);
          const temp = tempArr[j - 1];
          tempArr[j - 1] = tempArr[j];
          tempArr[j] = temp;
        }
      }
    }

    setAnimations(animationsArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAnimationAttributes = (i, j) => {
    let distance = (j - i) * 50;
    let animationAttr = {
      ...swapDetails,
      [i]: `${distance}px`,
      [j]: `-${distance}px`,
    };
    setSwapDetails(animationAttr);
  }

  const handleForwardAnimation = () => {
    // if currentAnimation out of bound
    if (currentAnimation === animations.length) return;
    // start the animation
    setIsAnimating(true);
    let swapToPerform = animations[currentAnimation];
    getAnimationAttributes(swapToPerform[0], swapToPerform[1]);
    // getting the current state and performing swap
    let newArrayState = [...array];
    swap(newArrayState, swapToPerform[0], swapToPerform[1]);
    // after a animations complete - update the state and stop animation
    setTimeout(() => {
      setIsAnimating(false);
      setArray(newArrayState);
      setCurrentAnimation(currentAnimation + 1);
      setSwapDetails({});
    }, animationSpeed);
  }

  const handleUndoAnimation = () => {
    // if currentAnimation out of bound
    if (currentAnimation === 0) return;
    // start the animation
    setIsAnimating(true);
    let swapToPerform = animations[currentAnimation - 1];
    setCurrentAnimation(currentAnimation - 1);
    getAnimationAttributes(swapToPerform[0], swapToPerform[1]);
    // getting the current state and performing swap
    let newArrayState = [...array];
    swap(newArrayState, swapToPerform[0], swapToPerform[1]);
    // after a animations complete - update the state and stop animation
    setTimeout(() => {
      setIsAnimating(false);
      setArray(newArrayState);
      setCurrentAnimation(currentAnimation - 1);
      setSwapDetails({});
    }, animationSpeed);
  }

  const swap = (array, i, j) => {
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }


  const getClassName = (idx) => {
    let className = ['bar'];
    if (isAnimating && animations && animations[currentAnimation] && animations[currentAnimation].length === 2) {
      let [swapIdx1, swapIdx2] = animations[currentAnimation];
      if (idx === swapIdx1 || idx === swapIdx2) {
        className.push('animate');
        if (idx === swapIdx2) className.push('active');
      }
    }
    if (currentAnimation === animations.length) className.push('complete');
    return className.join(' ');
  }

  return (
    <div>
      <h2>Move {currentAnimation} of {animations.length}</h2>
      <div className='visualization-container'>
        {
          array && array.map((val, i) => {
            return (
              <div
                className={getClassName(i)}
                key={i}
                style={{
                  height: `${val * 3}px`,
                  '--endpositon': swapDetails[i] ? swapDetails[i] : '0px',
                }}>
                {val}
              </div>)
          })
        }

      </div>
      <div style={{ display: 'flex' }}>
        <button
          disabled={currentAnimation === 0}
          onClick={handleUndoAnimation}
          className='btn'
        >
          {'<'}
        </button>
        <button
          disabled={currentAnimation === animations.length}
          onClick={handleForwardAnimation}
          className='btn'
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}
