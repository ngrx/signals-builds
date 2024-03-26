import { assertInInjectionContext, DestroyRef, effect, inject, Injector, isSignal, untracked, } from '@angular/core';
import { isObservable, noop, Subject } from 'rxjs';
export function rxMethod(generator, config) {
    if (!config?.injector) {
        assertInInjectionContext(rxMethod);
    }
    const injector = config?.injector ?? inject(Injector);
    const destroyRef = injector.get(DestroyRef);
    const source$ = new Subject();
    const sourceSub = generator(source$).subscribe();
    destroyRef.onDestroy(() => sourceSub.unsubscribe());
    const rxMethodFn = (input) => {
        if (isSignal(input)) {
            const watcher = effect(() => {
                const value = input();
                untracked(() => source$.next(value));
            }, { injector });
            const instanceSub = { unsubscribe: () => watcher.destroy() };
            sourceSub.add(instanceSub);
            return instanceSub;
        }
        if (isObservable(input)) {
            const instanceSub = input.subscribe((value) => source$.next(value));
            sourceSub.add(instanceSub);
            return instanceSub;
        }
        source$.next(input);
        return { unsubscribe: noop };
    };
    rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);
    return rxMethodFn;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtbWV0aG9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zaWduYWxzL3J4anMtaW50ZXJvcC9zcmMvcngtbWV0aG9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx3QkFBd0IsRUFDeEIsVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxFQUNSLFFBQVEsRUFFUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQWMsT0FBTyxFQUFrQixNQUFNLE1BQU0sQ0FBQztBQU8vRSxNQUFNLFVBQVUsUUFBUSxDQUN0QixTQUE4RCxFQUM5RCxNQUFnQztJQUVoQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFTLENBQUM7SUFFckMsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pELFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFFcEQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUEyQixFQUFFLEVBQUU7UUFDakQsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNwQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQ3BCLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDdEIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLEVBQ0QsRUFBRSxRQUFRLEVBQUUsQ0FDYixDQUFDO1lBQ0YsTUFBTSxXQUFXLEdBQUcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDN0QsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUzQixPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO1FBRUQsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN4QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDcEUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUzQixPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO1FBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixPQUFPLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9CLENBQUMsQ0FBQztJQUNGLFVBQVUsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFzc2VydEluSW5qZWN0aW9uQ29udGV4dCxcbiAgRGVzdHJveVJlZixcbiAgZWZmZWN0LFxuICBpbmplY3QsXG4gIEluamVjdG9yLFxuICBpc1NpZ25hbCxcbiAgU2lnbmFsLFxuICB1bnRyYWNrZWQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNPYnNlcnZhYmxlLCBub29wLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBVbnN1YnNjcmliYWJsZSB9IGZyb20gJ3J4anMnO1xuXG50eXBlIFJ4TWV0aG9kSW5wdXQ8SW5wdXQ+ID0gSW5wdXQgfCBPYnNlcnZhYmxlPElucHV0PiB8IFNpZ25hbDxJbnB1dD47XG5cbnR5cGUgUnhNZXRob2Q8SW5wdXQ+ID0gKChpbnB1dDogUnhNZXRob2RJbnB1dDxJbnB1dD4pID0+IFVuc3Vic2NyaWJhYmxlKSAmXG4gIFVuc3Vic2NyaWJhYmxlO1xuXG5leHBvcnQgZnVuY3Rpb24gcnhNZXRob2Q8SW5wdXQ+KFxuICBnZW5lcmF0b3I6IChzb3VyY2UkOiBPYnNlcnZhYmxlPElucHV0PikgPT4gT2JzZXJ2YWJsZTx1bmtub3duPixcbiAgY29uZmlnPzogeyBpbmplY3Rvcj86IEluamVjdG9yIH1cbik6IFJ4TWV0aG9kPElucHV0PiB7XG4gIGlmICghY29uZmlnPy5pbmplY3Rvcikge1xuICAgIGFzc2VydEluSW5qZWN0aW9uQ29udGV4dChyeE1ldGhvZCk7XG4gIH1cblxuICBjb25zdCBpbmplY3RvciA9IGNvbmZpZz8uaW5qZWN0b3IgPz8gaW5qZWN0KEluamVjdG9yKTtcbiAgY29uc3QgZGVzdHJveVJlZiA9IGluamVjdG9yLmdldChEZXN0cm95UmVmKTtcbiAgY29uc3Qgc291cmNlJCA9IG5ldyBTdWJqZWN0PElucHV0PigpO1xuXG4gIGNvbnN0IHNvdXJjZVN1YiA9IGdlbmVyYXRvcihzb3VyY2UkKS5zdWJzY3JpYmUoKTtcbiAgZGVzdHJveVJlZi5vbkRlc3Ryb3koKCkgPT4gc291cmNlU3ViLnVuc3Vic2NyaWJlKCkpO1xuXG4gIGNvbnN0IHJ4TWV0aG9kRm4gPSAoaW5wdXQ6IFJ4TWV0aG9kSW5wdXQ8SW5wdXQ+KSA9PiB7XG4gICAgaWYgKGlzU2lnbmFsKGlucHV0KSkge1xuICAgICAgY29uc3Qgd2F0Y2hlciA9IGVmZmVjdChcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQoKTtcbiAgICAgICAgICB1bnRyYWNrZWQoKCkgPT4gc291cmNlJC5uZXh0KHZhbHVlKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHsgaW5qZWN0b3IgfVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlU3ViID0geyB1bnN1YnNjcmliZTogKCkgPT4gd2F0Y2hlci5kZXN0cm95KCkgfTtcbiAgICAgIHNvdXJjZVN1Yi5hZGQoaW5zdGFuY2VTdWIpO1xuXG4gICAgICByZXR1cm4gaW5zdGFuY2VTdWI7XG4gICAgfVxuXG4gICAgaWYgKGlzT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlU3ViID0gaW5wdXQuc3Vic2NyaWJlKCh2YWx1ZSkgPT4gc291cmNlJC5uZXh0KHZhbHVlKSk7XG4gICAgICBzb3VyY2VTdWIuYWRkKGluc3RhbmNlU3ViKTtcblxuICAgICAgcmV0dXJuIGluc3RhbmNlU3ViO1xuICAgIH1cblxuICAgIHNvdXJjZSQubmV4dChpbnB1dCk7XG4gICAgcmV0dXJuIHsgdW5zdWJzY3JpYmU6IG5vb3AgfTtcbiAgfTtcbiAgcnhNZXRob2RGbi51bnN1YnNjcmliZSA9IHNvdXJjZVN1Yi51bnN1YnNjcmliZS5iaW5kKHNvdXJjZVN1Yik7XG5cbiAgcmV0dXJuIHJ4TWV0aG9kRm47XG59XG4iXX0=