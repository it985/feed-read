document.addEventListener("click", (event) => {
  const target = event.target;
  const isForward = target.closest(".js-horizontal-scroll__forward") !== null;
  const isBackward = target.closest(".js-horizontal-scroll__backward") !== null;

  if (isForward || isBackward) {
    const scrollAssembly = target.closest(".js-horizontal-scroll");
    const list = scrollAssembly.querySelector(".js-horizontal-scroll__list");

    // Determine the scroll amount and direction
    const scrollAmount = list.offsetWidth;
    list.scroll({
      left: list.scrollLeft + (isForward ? scrollAmount : -scrollAmount),
      behavior: "smooth",
    });
  }
});

const lists = document.querySelectorAll(".js-horizontal-scroll__list");

lists.forEach((list) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const group = entry.target.closest(".js-horizontal-scroll");
        const items = Array.from(group.querySelectorAll(".js-horizontal-scroll__item"));
        const index = items.indexOf(entry.target);

        // Toggle classes based on item visibility
        group.classList.toggle("has-backward", index > 0 && !entry.isIntersecting);
        group.classList.toggle("has-forward", index < items.length - 1 && !entry.isIntersecting);
      });
    },
    {
      root: list,
      rootMargin: "0px",
      threshold: 0.98, // Adjusted to avoid false positives
    }
  );

  // Observe the first and last items
  const items = Array.from(list.querySelectorAll(".js-horizontal-scroll__item"));
  if (items.length) {
    observer.observe(items[0]); // Observe the first item
    observer.observe(items[items.length - 1]); // Observe the last item
  }
});
